import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';
import hajjImg from '@/assets/hajj.jpg';
import hotelImg from '@/assets/hotel.jpg';
import studentImg from '@/assets/student.jpg';
import workImg from '@/assets/work.jpg';
import medicalImg from '@/assets/medical.jpg';
import cargoImg from '@/assets/cargo.jpg';

const Gallery = () => {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryImages = [
    { src: heroBg, caption: 'Flying above the clouds - The journey begins' },
    { src: hajjImg, caption: 'The sacred Kaaba - Hajj & Umrah pilgrimage' },
    { src: hotelImg, caption: 'Luxury accommodation awaits you' },
    { src: studentImg, caption: 'Celebrating academic success abroad' },
    { src: workImg, caption: 'Building international careers' },
    { src: medicalImg, caption: 'World-class medical care destinations' },
    { src: cargoImg, caption: 'Global cargo and shipping services' },
    { src: heroBg, caption: 'Sunset flights to exotic destinations' },
    { src: hajjImg, caption: 'Spiritual journeys that transform lives' },
    { src: hotelImg, caption: 'Premium hospitality experiences' },
    { src: studentImg, caption: 'Education opens doors worldwide' },
    { src: workImg, caption: 'Professional opportunities across borders' },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            {t.gallery.title}
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto animate-fade-in delay-200">
            {t.gallery.subtitle}
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl cursor-pointer hover-lift"
                onClick={() => setSelectedImage(image.src)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="aspect-square">
                  <img
                    src={image.src}
                    alt={image.caption}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-primary-foreground text-sm font-medium">
                      {image.caption}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-foreground/20 hover:bg-foreground/40 transition-colors"
          >
            <X className="h-6 w-6 text-primary-foreground" />
          </button>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Gallery image"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* CTA Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-poppins text-2xl md:text-3xl font-bold text-foreground mb-4">
            Share Your Travel Memories
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have amazing photos from your journey with Wayam Gofa? We'd love to feature them in our gallery. 
            Contact us to share your travel stories and inspire others!
          </p>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
