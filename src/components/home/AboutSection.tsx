import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Award, Calendar, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { key: 'students', icon: Users },
  { key: 'teachers', icon: Award },
  { key: 'years', icon: Calendar },
  { key: 'success', icon: TrendingUp },
];

const AboutSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Since 2016
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                {t('about.title')}
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                {t('about.subtitle')}
              </p>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              {t('about.description')}
            </p>
            
            <p className="text-muted-foreground leading-relaxed">
              {t('about.mission')}
            </p>

            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/about">
                {t('about.readMore')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-secondary rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">
                    {t(`about.stats.${stat.key}`)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t(`about.stats.${stat.key}Label`)}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
