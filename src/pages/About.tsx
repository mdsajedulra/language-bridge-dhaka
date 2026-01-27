import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Award, Calendar, Users, TrendingUp, Target, Eye, Heart } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLocalized } from '@/hooks/useLocalized';
import { Skeleton } from '@/components/ui/skeleton';

const About = () => {
  const { t } = useTranslation();
  const { getLocalizedText } = useLocalized();

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

  const { data: siteSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ['site-settings-about'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .in('key', ['mission', 'vision', 'values', 'about_story']);
      if (error) throw error;
      return data?.reduce((acc, item) => {
        acc[item.key] = item;
        return acc;
      }, {} as Record<string, any>);
    },
  });

  const stats = [
    { key: 'students', icon: Users, value: heroSettings?.stat_students || '5000+', label: 'Students Trained' },
    { key: 'teachers', icon: Award, value: heroSettings?.stat_teachers || '25+', label: 'Expert Teachers' },
    { key: 'years', icon: Calendar, value: heroSettings?.stat_years || '9+', label: 'Years Experience' },
    { key: 'success', icon: TrendingUp, value: '95%', label: 'Success Rate' },
  ];

  const values = [
    { 
      icon: Target, 
      title: 'Mission', 
      description: siteSettings?.mission 
        ? getLocalizedText(siteSettings.mission.value_en, siteSettings.mission.value_bn, siteSettings.mission.value_zh)
        : 'To foster cultural exchange and economic cooperation between Bangladesh and China by providing world-class Chinese language education.' 
    },
    { 
      icon: Eye, 
      title: 'Vision', 
      description: siteSettings?.vision
        ? getLocalizedText(siteSettings.vision.value_en, siteSettings.vision.value_bn, siteSettings.vision.value_zh)
        : 'To be the leading Chinese language education center in South Asia, creating bridges of understanding between nations.' 
    },
    { 
      icon: Heart, 
      title: 'Values', 
      description: siteSettings?.values
        ? getLocalizedText(siteSettings.values.value_en, siteSettings.values.value_bn, siteSettings.values.value_zh)
        : 'Excellence, integrity, cultural respect, student-centered learning, and continuous innovation in education.' 
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-foreground via-primary/90 to-foreground">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-background mb-6">
              {t('about.title')}
            </h1>
            <p className="text-xl text-muted">{t('about.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="prose prose-lg max-w-none"
            >
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {t('about.description')}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {t('about.mission')}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {siteSettings?.about_story
                  ? getLocalizedText(siteSettings.about_story.value_en, siteSettings.about_story.value_bn, siteSettings.about_story.value_zh)
                  : 'As the Belt and Road Initiative continues to strengthen ties between Bangladesh and China, the demand for Chinese language proficiency has grown exponentially. Our institute stands at the forefront of this cultural and economic exchange, preparing students for success in an increasingly interconnected world.'
                }
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-secondary">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="text-center p-6">
                    <CardContent className="pt-0">
                      <Icon className="h-12 w-12 mx-auto text-primary mb-4" />
                      <div className="text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                      <div className="text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full text-center p-8">
                    <CardContent className="pt-0">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-4">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Affiliation */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Award className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Official Recognition</h2>
            <p className="text-xl max-w-2xl mx-auto">
              Affiliated with Bangladesh Technical Education Board<br />
              <span className="font-bold">Affiliation No. 50803</span>
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
