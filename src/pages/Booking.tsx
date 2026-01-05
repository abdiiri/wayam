import { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Plane, User, CreditCard, CheckCircle, Copy, Upload, Phone, Smartphone } from 'lucide-react';

const PAYMENT_NUMBER = "0712345678";

interface ServiceType {
  id: string;
  title: string;
  title_ar: string | null;
}

const Booking = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'number' | null>(null);
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    passport: '',
    destination: '',
    startDate: '',
    endDate: '',
    notes: '',
    cardHolder: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  // Fetch services from database
  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('id, title, title_ar')
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) {
        console.error('Error fetching services:', error);
      } else {
        setServices(data || []);
      }
      setLoadingServices(false);
    };
    fetchServices();
  }, []);

  // Get selected service names for display/storage
  const selectedServiceNames = useMemo(() => {
    return services
      .filter(s => selectedServiceIds.includes(s.id))
      .map(s => language === 'ar' && s.title_ar ? s.title_ar : s.title);
  }, [selectedServiceIds, services, language]);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServiceIds(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT_NUMBER);
      toast({
        title: "Copied!",
        description: "Payment number copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy number",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG or PNG image",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setPaymentProofFile(file);
      setPaymentProofPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentProofFile) {
      toast({
        title: "Payment proof required",
        description: "Please upload a screenshot of your payment",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload payment proof
      const fileExt = paymentProofFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, paymentProofFile);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName);
      
      // Create booking with multiple services joined by comma
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user?.id || null,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          passport: formData.passport,
          service_type: selectedServiceNames.join(', '),
          destination: formData.destination,
          start_date: formData.startDate,
          end_date: formData.endDate || null,
          notes: formData.notes || null,
          payment_method: paymentMethod,
          payment_status: 'pending_confirmation',
          payment_proof_url: urlData.publicUrl,
          card_last_four: paymentMethod === 'card' ? formData.cardNumber.slice(-4) : null,
        });
      
      if (bookingError) throw bookingError;
      
      toast({
        title: t.booking.success,
        description: "Your booking is pending payment confirmation.",
      });
      
      setStep(4);
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit booking",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="min-h-screen pt-20 pb-20 bg-muted relative z-10">
      {/* Hero Section */}
      <section className="relative py-12 pb-16 bg-gradient-to-br from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-poppins text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in">
            {t.booking.title}
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto animate-fade-in delay-200">
            {t.booking.subtitle}
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4 bg-card p-4 rounded-full shadow-lg">
            {[
              { num: 1, icon: User, label: t.booking.personalInfo },
              { num: 2, icon: Plane, label: t.booking.travelDetails },
              { num: 3, icon: CreditCard, label: t.booking.paymentInfo },
            ].map((s, index) => (
              <div key={s.num} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    step >= s.num
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <s.icon className="h-5 w-5" />
                  <span className="hidden sm:inline font-medium">{s.label}</span>
                </div>
                {index < 2 && (
                  <div className={`w-8 h-1 mx-2 rounded ${step > s.num ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 relative z-20">
        <Card className="max-w-3xl mx-auto">
          {step === 4 ? (
            <CardContent className="p-12 text-center">
              <div className="animate-scale-in">
                <div className="inline-flex p-4 rounded-full bg-secondary/20 mb-6">
                  <CheckCircle className="h-16 w-16 text-secondary" />
                </div>
                <h2 className="font-poppins text-3xl font-bold text-card-foreground mb-4">
                  {t.booking.success}
                </h2>
                <p className="text-muted-foreground mb-8">
                  Your booking has been submitted successfully. Your payment is pending confirmation. Our team will review your payment proof and contact you within 24 hours.
                </p>
                <div className="bg-muted p-6 rounded-lg text-left mb-8">
                  <h4 className="font-semibold mb-4">Booking Summary:</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Name:</span> {formData.name}</p>
                    <p><span className="text-muted-foreground">Services:</span> {selectedServiceNames.join(', ')}</p>
                    <p><span className="text-muted-foreground">Destination:</span> {formData.destination}</p>
                    <p><span className="text-muted-foreground">Travel Date:</span> {formData.startDate}</p>
                    <p><span className="text-muted-foreground">Payment Method:</span> {paymentMethod === 'card' ? 'Card Payment' : 'Payment by Number'}</p>
                    <p><span className="text-muted-foreground">Payment Status:</span> <span className="text-yellow-600 font-medium">Pending Confirmation</span></p>
                  </div>
                </div>
                <Button onClick={() => window.location.href = '/'} className="bg-primary hover:bg-primary/90">
                  Return to Home
                </Button>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <User className="h-6 w-6 text-primary" />
                      {t.booking.personalInfo}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">{t.booking.name}</label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">{t.booking.email}</label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="email@example.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">{t.booking.phone}</label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+254 700 000 000"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{t.booking.passport}</label>
                      <Input
                        type="text"
                        value={formData.passport}
                        onChange={(e) => setFormData({ ...formData, passport: e.target.value })}
                        placeholder="Enter passport number"
                        required
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        onClick={() => setStep(2)}
                        disabled={!formData.name || !formData.email || !formData.phone || !formData.passport}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </>
              )}

              {/* Step 2: Travel Details */}
              {step === 2 && (
                <>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Plane className="h-6 w-6 text-primary" />
                      {t.booking.travelDetails}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-3">{t.booking.serviceType} (Select one or more)</label>
                      {loadingServices ? (
                        <p className="text-muted-foreground">Loading services...</p>
                      ) : services.length === 0 ? (
                        <p className="text-muted-foreground">No services available</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {services.map((service) => {
                            const isSelected = selectedServiceIds.includes(service.id);
                            const displayTitle = language === 'ar' && service.title_ar ? service.title_ar : service.title;
                            return (
                              <label
                                key={service.id}
                                htmlFor={`service-${service.id}`}
                                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                                  isSelected
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border hover:border-primary/50'
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <Checkbox
                                    id={`service-${service.id}`}
                                    checked={isSelected}
                                    onCheckedChange={() => handleServiceToggle(service.id)}
                                  />
                                  <span className="text-sm font-medium">
                                    {displayTitle}
                                  </span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      )}
                      {selectedServiceIds.length > 0 && (
                        <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                          <p className="text-sm text-muted-foreground">
                            Selected: {selectedServiceNames.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{t.booking.destination}</label>
                      <Input
                        type="text"
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        placeholder="e.g., Dubai, Mecca, London"
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">{t.booking.startDate}</label>
                        <Input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">{t.booking.endDate}</label>
                        <Input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{t.booking.notes}</label>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Any special requests or requirements..."
                        rows={4}
                      />
                    </div>
                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setStep(3)}
                        disabled={selectedServiceIds.length === 0 || !formData.destination || !formData.startDate}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <CreditCard className="h-6 w-6 text-primary" />
                      {t.booking.paymentInfo}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Payment Method Selection */}
                    {!paymentMethod && (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground mb-4">
                          Choose your preferred payment method:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('card')}
                            className="p-6 border-2 border-border rounded-lg hover:border-primary transition-colors text-left"
                          >
                            <CreditCard className="h-8 w-8 text-primary mb-3" />
                            <h3 className="font-semibold mb-1">Card Payment</h3>
                            <p className="text-sm text-muted-foreground">Pay using your debit or credit card</p>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('number')}
                            className="p-6 border-2 border-border rounded-lg hover:border-primary transition-colors text-left"
                          >
                            <Smartphone className="h-8 w-8 text-primary mb-3" />
                            <h3 className="font-semibold mb-1">Payment by Number</h3>
                            <p className="text-sm text-muted-foreground">Pay via mobile money or bank transfer</p>
                          </button>
                        </div>
                        <div className="flex justify-start pt-4">
                          <Button type="button" variant="outline" onClick={() => setStep(2)}>
                            Back
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Card Payment Form */}
                    {paymentMethod === 'card' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Card Payment
                          </h3>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setPaymentMethod(null)}
                          >
                            Change Method
                          </Button>
                        </div>
                        
                        <div className="bg-muted p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            Your payment information is secure. We use industry-standard encryption to protect your data.
                          </p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">{t.booking.cardHolder}</label>
                          <Input
                            type="text"
                            value={formData.cardHolder}
                            onChange={(e) => setFormData({ ...formData, cardHolder: e.target.value })}
                            placeholder="Name on card"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">{t.booking.cardNumber}</label>
                          <Input
                            type="text"
                            value={formData.cardNumber}
                            onChange={(e) => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium mb-2">{t.booking.expiry}</label>
                            <Input
                              type="text"
                              value={formData.expiry}
                              onChange={(e) => setFormData({ ...formData, expiry: formatExpiry(e.target.value) })}
                              placeholder="MM/YY"
                              maxLength={5}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">{t.booking.cvv}</label>
                            <Input
                              type="text"
                              value={formData.cvv}
                              onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                              placeholder="123"
                              maxLength={4}
                              required
                            />
                          </div>
                        </div>
                        
                        {/* Payment Proof Upload for Card */}
                        <div className="border-t pt-6">
                          <label className="block text-sm font-medium mb-2">Payment Proof Screenshot</label>
                          <p className="text-sm text-muted-foreground mb-4">
                            After completing your payment, take a screenshot and upload it here for verification.
                          </p>
                          
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                          
                          {paymentProofPreview ? (
                            <div className="space-y-4">
                              <div className="relative border rounded-lg overflow-hidden">
                                <img 
                                  src={paymentProofPreview} 
                                  alt="Payment proof preview" 
                                  className="w-full max-h-48 object-contain bg-muted"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full"
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Change Image
                              </Button>
                            </div>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full py-8 border-dashed"
                            >
                              <div className="text-center">
                                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                <p className="font-medium">Upload Payment Screenshot</p>
                                <p className="text-sm text-muted-foreground">JPG or PNG, max 5MB</p>
                              </div>
                            </Button>
                          )}
                        </div>
                        
                        <div className="flex justify-between pt-4">
                          <Button type="button" variant="outline" onClick={() => setStep(2)}>
                            Back
                          </Button>
                          <Button
                            type="submit"
                            disabled={isSubmitting || !formData.cardHolder || !formData.cardNumber || !formData.expiry || !formData.cvv || !paymentProofFile}
                            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                          >
                            {isSubmitting ? 'Processing...' : t.booking.submit}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Payment by Number Form */}
                    {paymentMethod === 'number' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold flex items-center gap-2">
                            <Phone className="h-5 w-5" />
                            Payment by Number
                          </h3>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setPaymentMethod(null)}
                          >
                            Change Method
                          </Button>
                        </div>
                        
                        <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
                          <p className="text-sm text-muted-foreground mb-4">
                            Send your payment to the following number:
                          </p>
                          <div className="flex items-center justify-between bg-card p-4 rounded-lg border">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Payment Number</p>
                              <p className="text-2xl font-bold font-mono tracking-wider">{PAYMENT_NUMBER}</p>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleCopyNumber}
                              className="flex items-center gap-2"
                            >
                              <Copy className="h-4 w-4" />
                              Copy
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-4">
                            After sending payment, take a screenshot as proof and upload it below.
                          </p>
                        </div>
                        
                        {/* Payment Proof Upload */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Payment Proof Screenshot *</label>
                          <p className="text-sm text-muted-foreground mb-4">
                            Upload a screenshot of your completed payment for verification.
                          </p>
                          
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                          
                          {paymentProofPreview ? (
                            <div className="space-y-4">
                              <div className="relative border rounded-lg overflow-hidden">
                                <img 
                                  src={paymentProofPreview} 
                                  alt="Payment proof preview" 
                                  className="w-full max-h-48 object-contain bg-muted"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full"
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Change Image
                              </Button>
                            </div>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full py-8 border-dashed"
                            >
                              <div className="text-center">
                                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                <p className="font-medium">Upload Payment Screenshot</p>
                                <p className="text-sm text-muted-foreground">JPG or PNG, max 5MB</p>
                              </div>
                            </Button>
                          )}
                        </div>
                        
                        <div className="flex justify-between pt-4">
                          <Button type="button" variant="outline" onClick={() => setStep(2)}>
                            Back
                          </Button>
                          <Button
                            type="submit"
                            disabled={isSubmitting || !paymentProofFile}
                            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                          >
                            {isSubmitting ? 'Processing...' : t.booking.submit}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </>
              )}
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Booking;