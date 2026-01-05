import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Pencil, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface GalleryItem {
  id: string;
  title: string;
  title_ar: string | null;
  description: string | null;
  description_ar: string | null;
  image_url: string;
  category: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

const AdminGallery = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    title_ar: '',
    description: '',
    description_ar: '',
    image_url: '',
    category: '',
    is_active: true,
  });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setGallery(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch gallery',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);

      setFormData({ ...formData, image_url: publicUrl });
      toast({ title: 'Success', description: 'Image uploaded successfully' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.image_url) {
      toast({
        title: 'Error',
        description: 'Title and image are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (selectedItem) {
        const { error } = await supabase
          .from('gallery')
          .update({
            title: formData.title,
            title_ar: formData.title_ar || null,
            description: formData.description || null,
            description_ar: formData.description_ar || null,
            image_url: formData.image_url,
            category: formData.category || null,
            is_active: formData.is_active,
          })
          .eq('id', selectedItem.id);

        if (error) throw error;
        toast({ title: 'Success', description: 'Gallery item updated successfully' });
      } else {
        const { error } = await supabase
          .from('gallery')
          .insert({
            title: formData.title,
            title_ar: formData.title_ar || null,
            description: formData.description || null,
            description_ar: formData.description_ar || null,
            image_url: formData.image_url,
            category: formData.category || null,
            is_active: formData.is_active,
            sort_order: gallery.length,
          });

        if (error) throw error;
        toast({ title: 'Success', description: 'Gallery item created successfully' });
      }

      setDialogOpen(false);
      resetForm();
      fetchGallery();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save gallery item',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', selectedItem.id);

      if (error) throw error;
      toast({ title: 'Success', description: 'Gallery item deleted successfully' });
      setDeleteDialogOpen(false);
      setSelectedItem(null);
      fetchGallery();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete gallery item',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (item: GalleryItem) => {
    setSelectedItem(item);
    setFormData({
      title: item.title,
      title_ar: item.title_ar || '',
      description: item.description || '',
      description_ar: item.description_ar || '',
      image_url: item.image_url,
      category: item.category || '',
      is_active: item.is_active,
    });
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setSelectedItem(null);
    resetForm();
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      title_ar: '',
      description: '',
      description_ar: '',
      image_url: '',
      category: '',
      is_active: true,
    });
    setSelectedItem(null);
  };

  const toggleActive = async (item: GalleryItem) => {
    try {
      const { error } = await supabase
        .from('gallery')
        .update({ is_active: !item.is_active })
        .eq('id', item.id);

      if (error) throw error;
      fetchGallery();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update gallery item',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-poppins font-bold">Manage Gallery</h1>
          <p className="text-muted-foreground">Upload and manage gallery images</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Image
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gallery ({gallery.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading gallery...</p>
          ) : gallery.length === 0 ? (
            <p className="text-muted-foreground">No gallery items yet. Click "Add Image" to create one.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className="relative group rounded-lg overflow-hidden border bg-card"
                >
                  <div className="aspect-video relative">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {!item.is_active && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Hidden</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium truncate">{item.title}</h3>
                    {item.category && (
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openEditDialog(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-red-600"
                      onClick={() => {
                        setSelectedItem(item);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-14 right-2">
                    <Switch
                      checked={item.is_active}
                      onCheckedChange={() => toggleActive(item)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Image *</Label>
              <div className="flex gap-4">
                <div
                  className="w-40 h-28 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {formData.image_url ? (
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <ImageIcon className="h-8 w-8 mx-auto mb-1" />
                      <span className="text-xs">Click to upload</span>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex-1">
                  <Label className="text-sm text-muted-foreground">Or paste image URL</Label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                    className="mt-1"
                  />
                  {uploading && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title (English) *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Image title"
                />
              </div>
              <div className="space-y-2">
                <Label>Title (Arabic)</Label>
                <Input
                  value={formData.title_ar}
                  onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                  placeholder="عنوان الصورة"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Description (English)</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Image description"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Description (Arabic)</Label>
                <Textarea
                  value={formData.description_ar}
                  onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                  placeholder="وصف الصورة"
                  dir="rtl"
                  rows={2}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Hajj, Travel, Services"
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Active (visible to public)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={uploading}>
              {selectedItem ? 'Update Item' : 'Create Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Gallery Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedItem?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminGallery;