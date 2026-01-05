import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plane, Hotel, Moon as MoonIcon, GraduationCap, Briefcase, 
  Heart, Package, Zap, DollarSign, Users, Headphones, Award, Shield,
  Loader2
} from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';
import hajjImg from '@/assets/hajj.jpg';

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

const Index = () => {
  const { t, language } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

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
      setLoadingServices(false);
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

  const whyChooseUs = [
    { icon: Zap, title: t.whyChoose.fastVisa.title, description: t.whyChoose.fastVisa.description },
    { icon: DollarSign, title: t.whyChoose.affordable.title, description: t.whyChoose.affordable.description },
    { icon: Users, title: t.whyChoose.trusted.title, description: t.whyChoose.trusted.description },
    { icon: Headphones, title: t.whyChoose.support.title, description: t.whyChoose.support.description },
    { icon: Award, title: t.whyChoose.professional.title, description: t.whyChoose.professional.description },
    { icon: Shield, title: t.whyChoose.reliable.title, description: t.whyChoose.reliable.description },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-secondary/60" />
        <div className="relative z-10 container mx-auto px-4 py-32 text-center">
          <h1 className="font-poppins text-4xl md:text-5xl lg:text-7xl font-bold text-primary-foreground mb-6 animate-fade-in">
            {t.hero.title}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-primary-foreground/90 max-w-3xl mx-auto mb-10 animate-fade-in delay-200">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-300">
            <Link to="/booking">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg px-8 py-6">
                {t.hero.cta}
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-bold text-lg px-8 py-6 bg-transparent">
                {t.hero.explore}
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {t.services.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.services.subtitle}
            </p>
          </div>
          {loadingServices ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : services.length === 0 ? (
            <p className="text-center text-muted-foreground">No services available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service, index) => {
                const IconComponent = getIcon(service.icon);
                return (
                  <Card 
                    key={service.id} 
                    className="group overflow-hidden hover-lift cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={service.image_url || heroBg} 
                        alt={getTitle(service)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 p-3 rounded-full bg-primary text-primary-foreground">
                        <IconComponent className="h-6 w-6" />
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-poppins font-semibold text-xl mb-2 text-card-foreground">
                        {getTitle(service)}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {getDescription(service)}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          <div className="text-center mt-12">
            <Link to="/services">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                {t.hero.explore}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h2 className="font-poppins text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                {t.about.title}
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                {t.about.historyText}
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="p-4 bg-card rounded-lg">
                  <h4 className="font-poppins font-semibold text-primary mb-2">{t.about.mission}</h4>
                  <p className="text-sm text-muted-foreground">{t.about.missionText}</p>
                </div>
                <div className="p-4 bg-card rounded-lg">
                  <h4 className="font-poppins font-semibold text-secondary mb-2">{t.about.vision}</h4>
                  <p className="text-sm text-muted-foreground">{t.about.visionText}</p>
                </div>
              </div>
              <Link to="/about">
                <Button className="bg-secondary hover:bg-secondary/90">
                  {t.nav.about}
                </Button>
              </Link>
            </div>
            <div className="relative animate-slide-in-right">
              <img 
                src={hajjImg} 
                alt="About Wayam Gofa"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-6 rounded-xl shadow-lg">
                <p className="font-poppins font-bold text-3xl">10+</p>
                <p className="text-sm">Years Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {t.whyChoose.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.whyChoose.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <div 
                key={index}
                className="flex gap-4 p-6 bg-card rounded-xl hover-lift border border-border"
              >
                <div className="flex-shrink-0 p-3 rounded-lg bg-primary/10 text-primary h-fit">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-poppins font-semibold text-lg text-card-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Airlines */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-poppins text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t.partners.title}
            </h2>
            <p className="text-muted-foreground">{t.partners.subtitle}</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {['EgyptAir', 'KLM', 'Emirates', 'Ethiopian Airlines', 'Air France'].map((airline, index) => (
              <div 
                key={index}
                className="px-8 py-4 bg-card rounded-lg shadow-sm border border-border hover-lift"
              >
                <span className="font-poppins font-semibold text-lg text-muted-foreground">
                  {airline}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Bar */}
      <section className="py-12 bg-primary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-primary-foreground">
            <div className="text-center md:text-left">
              <h3 className="font-poppins text-2xl font-bold mb-2">Ready to Start Your Journey?</h3>
              <p className="opacity-90">Contact us today and let us make your travel dreams come true!</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <a href="tel:0720092973" className="font-semibold hover:text-accent transition-colors">
                📞 0720-092-973
              </a>
              <a href="tel:0721422406" className="font-semibold hover:text-accent transition-colors">
                📞 0721-422-406
              </a>
              <Link to="/contact">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  {t.nav.contact}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
