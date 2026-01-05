import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

const Contact = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });
    
    setFormData({ name: '', email: '', phone: '', message: '' });
    setIsSubmitting(false);
  };

  const contactInfo = [
    { 
      icon: Phone, 
      title: 'Phone Numbers', 
      details: ['0720-092-973', '0721-422-406'],
      link: 'tel:0720092973'
    },
    { 
      icon: Mail, 
      title: 'Email Address', 
      details: ['wayamgofatravelagencylimited@gmail.com'],
      link: 'mailto:wayamgofatravelagencylimited@gmail.com'
    },
    { 
      icon: MapPin, 
      title: 'Office Location', 
      details: [t.contact.locationText],
      link: 'https://maps.google.com/?q=Eastleigh+Nairobi+Kenya'
    },
    { 
      icon: Clock, 
      title: 'Business Hours', 
      details: ['Mon - Fri: 8:00 AM - 6:00 PM', 'Saturday: 9:00 AM - 4:00 PM'],
      link: null
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            {t.contact.title}
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto animate-fade-in delay-200">
            {t.contact.subtitle}
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="font-poppins text-2xl md:text-3xl font-bold text-foreground mb-8">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t.contact.name}
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    required
                    className="bg-card"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t.contact.email}
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      required
                      className="bg-card"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t.contact.phone}
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+254 700 000 000"
                      className="bg-card"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t.contact.message}
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help you?"
                    required
                    rows={6}
                    className="bg-card"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      {t.contact.send}
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="font-poppins text-2xl md:text-3xl font-bold text-foreground mb-8">
                Get in Touch
              </h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="hover-lift">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 p-3 rounded-full bg-primary/10">
                          <info.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-poppins font-semibold text-lg text-card-foreground mb-2">
                            {info.title}
                          </h3>
                          {info.details.map((detail, i) => (
                            info.link ? (
                              <a
                                key={i}
                                href={info.link}
                                className="block text-muted-foreground hover:text-primary transition-colors"
                              >
                                {detail}
                              </a>
                            ) : (
                              <p key={i} className="text-muted-foreground">{detail}</p>
                            )
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="font-poppins text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
            {t.contact.location}
          </h2>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.818891261089!2d36.85259731475399!3d-1.2784369990632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f17e7c6c48f41%3A0x8d5dbf93f7e3c!2sEastleigh%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1624012345678!5m2!1sen!2ske"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Wayam Gofa Location"
            />
          </div>
          <p className="text-center text-muted-foreground mt-6">
            {t.contact.locationText}
          </p>
        </div>
      </section>
    </div>
  );
};

export default Contact;
