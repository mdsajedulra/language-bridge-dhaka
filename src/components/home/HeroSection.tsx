import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background with Chinese pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-foreground via-primary/90 to-foreground chinese-pattern" />
      
      {/* Animated floating characters */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['中', '文', '学', '习', '友', '谊'].map((char, i) => (
          <motion.span
            key={i}
            className="absolute text-6xl font-chinese text-primary/10 select-none"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            {char}
          </motion.span>
        ))}
      </div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-4">
              🇧🇩 Bangladesh - China 🇨🇳 Friendship
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-background leading-tight"
          >
            {t('hero.tagline')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted max-w-2xl mx-auto"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 h-14"
            >
              <Link to="/admission">
                {t('hero.enrollNow')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-background/50 text-background hover:bg-background/10 text-lg px-8 h-14"
            >
              <Link to="/courses">{t('hero.viewCourses')}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="text-background hover:bg-background/10 text-lg px-8 h-14"
            >
              <Link to="/contact">{t('hero.contactUs')}</Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-4 sm:gap-8 pt-12 max-w-lg mx-auto"
          >
            <div className="text-center">
              <GraduationCap className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-2xl sm:text-3xl font-bold text-background">5000+</div>
              <div className="text-sm text-muted">Students</div>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-2xl sm:text-3xl font-bold text-background">25+</div>
              <div className="text-sm text-muted">Teachers</div>
            </div>
            <div className="text-center">
              <BookOpen className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-2xl sm:text-3xl font-bold text-background">9+</div>
              <div className="text-sm text-muted">Years</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-background/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-background/50 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
