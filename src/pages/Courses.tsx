import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, BookOpen, Laptop, Moon, Zap, Baby, Award, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLocalized } from '@/hooks/useLocalized';
import { Skeleton } from '@/components/ui/skeleton';

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Award,
  Zap,
  Moon,
  Laptop,
  Baby,
};

const Courses = () => {
  const { t } = useTranslation();
  const { getLocalizedField } = useLocalized();

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return data;
    },
  });

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
              {t('courses.title')}
            </h1>
            <p className="text-xl text-muted">{t('courses.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20 bg-background">
        <div className="container">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-80 rounded-xl" />
              ))}
            </div>
          ) : courses && courses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, index) => {
                const Icon = iconMap[course.icon || 'BookOpen'] || BookOpen;
                return (
                  <motion.div
                    key={course.id}
                    id={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-all group">
                      <CardHeader>
                        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Icon className="h-8 w-8" />
                        </div>
                        {course.price && (
                          <Badge variant="secondary" className="w-fit mb-2">
                            ৳{course.price}
                          </Badge>
                        )}
                        <CardTitle className="text-2xl">{getLocalizedField(course, 'title')}</CardTitle>
                        <CardDescription className="text-muted-foreground text-base">
                          {getLocalizedField(course, 'description')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>{getLocalizedField(course, 'duration') || 'Flexible'}</span>
                          </div>
                        </div>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Expert native Chinese teachers</li>
                          <li>• Comprehensive study materials</li>
                          <li>• Certificate upon completion</li>
                          <li>• Job placement support</li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button asChild className="w-full bg-primary hover:bg-primary/90">
                          <Link to="/admission">
                            Enroll Now
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No courses available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-accent text-accent-foreground">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of successful students who have mastered Chinese with us.
            </p>
            <Button asChild size="lg" variant="secondary" className="text-lg">
              <Link to="/admission">
                Apply Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Courses;
