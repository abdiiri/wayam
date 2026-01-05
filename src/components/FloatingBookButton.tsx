import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const FloatingBookButton = () => {
  const { t } = useLanguage();

  return (
    <Link to="/booking" className="fixed bottom-6 left-6 z-50">
      <Button 
        size="lg" 
        className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-lg animate-pulse-glow"
      >
        {t.nav.booking}
      </Button>
    </Link>
  );
};

export default FloatingBookButton;
