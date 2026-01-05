import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo.png';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Wayam Gofa" className="h-14 w-14 object-contain bg-white rounded-lg p-1" />
              <div>
                <h3 className="font-poppins font-bold text-xl">Wayam Gofa</h3>
                <p className="text-sm opacity-80">Travellers Agency Limited</p>
              </div>
            </div>
            <p className="italic text-lg mb-4">"{t.footer.slogan}"</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-accent transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-accent transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-accent transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="hover:text-accent transition-colors"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-poppins font-semibold text-lg mb-6">{t.footer.quickLinks}</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-accent transition-colors">{t.nav.home}</Link></li>
              <li><Link to="/about" className="hover:text-accent transition-colors">{t.nav.about}</Link></li>
              <li><Link to="/services" className="hover:text-accent transition-colors">{t.nav.services}</Link></li>
              <li><Link to="/gallery" className="hover:text-accent transition-colors">{t.nav.gallery}</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors">{t.nav.contact}</Link></li>
              <li><Link to="/booking" className="hover:text-accent transition-colors">{t.nav.booking}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-poppins font-semibold text-lg mb-6">{t.footer.contactInfo}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p>0720-092-973</p>
                  <p>0721-422-406</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p className="break-all text-sm">wayamgofatravelagencylimited@gmail.com</p>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{t.contact.locationText}</p>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="font-poppins font-semibold text-lg mb-6">Business Hours</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Monday - Friday</span>
                <span>8:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>9:00 AM - 4:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/20">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm opacity-80">
            © {new Date().getFullYear()} Wayam Gofa Travellers Agency Limited. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
