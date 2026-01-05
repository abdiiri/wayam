import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Eye, History, Award, Users, Shield } from 'lucide-react';
import hajjImg from '@/assets/hajj.jpg';
import hotelImg from '@/assets/hotel.jpg';

const About = () => {
  const { t } = useLanguage();

  const values = [
    { icon: Award, title: 'Excellence', description: 'We strive for excellence in every service we provide, ensuring the highest quality standards.' },
    { icon: Users, title: 'Customer First', description: 'Our customers are at the heart of everything we do. Your satisfaction is our priority.' },
    { icon: Shield, title: 'Trust & Integrity', description: 'We build lasting relationships based on trust, transparency, and ethical practices.' },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            {t.about.title}
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto animate-fade-in delay-200">
            {t.about.subtitle}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <History className="h-8 w-8 text-primary" />
                <h2 className="font-poppins text-3xl font-bold text-foreground">{t.about.history}</h2>
              </div>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {t.about.historyText}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Founded with a passion for connecting people across the globe, Wayam Gofa Travellers Agency has been serving the East African community with dedication and excellence. From humble beginnings in Nairobi's vibrant Eastleigh district, we have grown to become a trusted name in the travel industry.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Our team of experienced travel consultants brings decades of combined expertise in airline bookings, visa processing, pilgrimage packages, and international cargo services. We understand the unique needs of our diverse clientele and tailor our services accordingly.
              </p>
            </div>
            <div className="relative">
              <img 
                src={hotelImg} 
                alt="Our Journey"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-8 -right-8 bg-card p-6 rounded-xl shadow-xl border border-border">
                <p className="font-poppins font-bold text-4xl text-primary">1000+</p>
                <p className="text-muted-foreground">Happy Travelers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="overflow-hidden hover-lift">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-poppins text-2xl font-bold text-card-foreground">{t.about.mission}</h3>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t.about.missionText}
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Deliver exceptional travel experiences
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Provide competitive and transparent pricing
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Ensure customer satisfaction at every step
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover-lift">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-full bg-secondary/10">
                    <Eye className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-poppins text-2xl font-bold text-card-foreground">{t.about.vision}</h3>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t.about.visionText}
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    Lead the travel industry in East Africa
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    Expand our services globally
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    Innovate and embrace technology
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-3xl md:text-4xl font-bold text-foreground mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do and define who we are as a company.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-8 bg-card rounded-xl border border-border hover-lift">
                <div className="inline-flex p-4 rounded-full bg-primary/10 mb-6">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-poppins text-xl font-bold text-card-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team/Credibility */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img 
                src={hajjImg} 
                alt="Our Commitment"
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div>
              <h2 className="font-poppins text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Trust Wayam Gofa?
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-poppins font-semibold text-lg text-foreground mb-1">Licensed & Registered</h4>
                    <p className="text-muted-foreground">Fully licensed travel agency operating under Kenya's tourism regulations.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-poppins font-semibold text-lg text-foreground mb-1">IATA Accredited</h4>
                    <p className="text-muted-foreground">Partner with major international airlines for the best flight deals.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-poppins font-semibold text-lg text-foreground mb-1">Proven Track Record</h4>
                    <p className="text-muted-foreground">Thousands of satisfied customers and successful visa applications.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
