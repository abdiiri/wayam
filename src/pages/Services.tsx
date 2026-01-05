import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plane, Hotel, Moon as MoonIcon, GraduationCap, Briefcase, 
  Heart, Package, ArrowRight, Loader2 
} from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Plane,
  Hotel,
  Moon: MoonIcon,
  MoonIcon,
  GraduationCap,
  Briefcase,
  Heart,
  Package,
};

interface Service {
  id: string;
  title: string;
  title_ar: string | null;
  description: string;
  description_ar: string | null;
  icon: string;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
}

const Services = () => {
  const { t, language } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    return iconMap[iconName] || Briefcase;
  };

  const getTitle = (service: Service) => {
    return language === 'ar' && service.title_ar ? service.title_ar : service.title;
  };

  const getDescription = (service: Service) => {
    return language === 'ar' && service.description_ar ? service.description_ar : service.description;
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            {t.services.title}
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto animate-fade-in delay-200">
            {t.services.subtitle}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No services available at the moment.</p>
            </div>
          ) : (
            <div className="grid gap-8">
              {services.map((service, index) => {
                const IconComponent = getIcon(service.icon);
                return (
                  <Card 
                    key={service.id} 
                    className={`overflow-hidden hover-lift ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}
                  >
                    <div className="grid lg:grid-cols-2">
                      <div className={`relative h-64 lg:h-auto ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                        <img 
                          src={service.image_url || heroBg} 
                          alt={getTitle(service)}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
                      </div>
                      <div className={`p-8 lg:p-12 flex flex-col justify-center ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="p-3 rounded-full bg-primary/10">
                            <IconComponent className="h-8 w-8 text-primary" />
                          </div>
                          <h3 className="font-poppins text-2xl md:text-3xl font-bold text-card-foreground">
                            {getTitle(service)}
                          </h3>
                        </div>
                        <p className="text-muted-foreground mb-6 text-lg">
                          {getDescription(service)}
                        </p>
                        <Link to="/booking" className="inline-flex">
                          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground group">
                            Book This Service
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-poppins text-3xl md:text-4xl font-bold text-foreground mb-6">
            Need a Custom Travel Package?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Can't find what you're looking for? Contact us and we'll create a personalized travel solution just for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Contact Us
              </Button>
            </Link>
            <Link to="/booking">
              <Button size="lg" variant="outline">
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;