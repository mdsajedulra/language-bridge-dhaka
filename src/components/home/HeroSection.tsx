import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, Users, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const HeroSection = () => {
  const { t, i18n } = useTranslation();

  const { data: heroSettings } = useQuery({
    queryKey: ['hero-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_settings')
        .select('*')
        .limit(1)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const lang = i18n.language as 'en' | 'bn' | 'zh';
  const getLocalizedText = (en?: string, bn?: string, zh?: string) => {
    if (lang === 'bn' && bn) return bn;
    if (lang === 'zh' && zh) return zh;
    return en || '';
  };

  const tagline = heroSettings 
    ? getLocalizedText(heroSettings.tagline_en, heroSettings.tagline_bn, heroSettings.tagline_zh)
    : t('hero.tagline');
  
  const subtitle = heroSettings
    ? getLocalizedText(heroSettings.subtitle_en, heroSettings.subtitle_bn, heroSettings.subtitle_zh)
    : t('hero.subtitle');

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-black">
      {/* Layered background gradients */}
      <div className="absolute inset-0">
        {/* Main gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-primary/20 to-brand-black" />
        
        {/* Radial glow effects */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/30 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] translate-y-1/2" />
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 chinese-pattern opacity-30" />
      </div>

      {/* Animated floating Chinese characters */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['中', '文', '学', '习', '友', '谊', '教', '育'].map((char, i) => (
          <motion.span
            key={i}
            className="absolute text-7xl md:text-9xl font-chinese text-primary/5 select-none font-bold"
            style={{
              left: `${5 + i * 12}%`,
              top: `${15 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [-30, 30, -30],
              rotate: [-5, 5, -5],
              opacity: [0.03, 0.08, 0.03],
            }}
            transition={{
              duration: 8 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          >
            {char}
          </motion.span>
        ))}
      </div>

      {/* Decorative lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      </div>

      <div className="container relative z-10 py-20">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/20 border border-primary/30 text-primary-foreground text-sm font-medium backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-brand-gold" />
              {heroSettings?.badge_text || '🇧🇩 Bangladesh - China 🇨🇳 Friendship'}
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-primary-foreground leading-[1.1] tracking-tight">
              <span className="bg-gradient-to-r from-primary-foreground via-primary-foreground to-primary/80 bg-clip-text text-transparent">
                {tagline}
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-primary-foreground/70 max-w-3xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 h-14 rounded-full shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:shadow-accent/30 hover:scale-105"
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
              className="border-primary/50 text-primary-foreground bg-primary/10 hover:bg-primary/20 text-lg px-8 h-14 rounded-full backdrop-blur-sm transition-all hover:scale-105"
            >
              <Link to="/courses">{t('hero.viewCourses')}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 h-14 rounded-full transition-all"
            >
              <Link to="/contact">{t('hero.contactUs')}</Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-3 gap-6 sm:gap-12 pt-16 max-w-2xl mx-auto"
          >
            {[
              { icon: GraduationCap, value: heroSettings?.stat_students || '5000+', label: t('hero.students') },
              { icon: Users, value: heroSettings?.stat_teachers || '25+', label: t('hero.teachers') },
              { icon: BookOpen, value: heroSettings?.stat_years || '9+', label: t('hero.years') },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/20 border border-accent/30 mb-4 group-hover:bg-accent/30 transition-colors">
                  <stat.icon className="h-7 w-7 text-accent" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-primary-foreground/60">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-7 h-12 border-2 border-primary-foreground/30 rounded-full flex items-start justify-center p-2">
          <motion.div 
            className="w-1.5 h-3 bg-primary rounded-full"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
