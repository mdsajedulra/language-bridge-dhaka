import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Mail, Phone } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLocalized } from '@/hooks/useLocalized';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const Teachers = () => {
  const { getLocalizedField } = useLocalized();

  const { data: teachers, isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teachers' as any)
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data as any[];
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
              Our Teachers
            </h1>
            <p className="text-xl text-muted">
              Meet our expert language instructors
            </p>
          </motion.div>
        </div>
      </section>

      {/* Teachers Grid */}
      <section className="py-20 bg-background">
        <div className="container">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-72 rounded-xl" />
              ))}
            </div>
          ) : teachers && teachers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teachers.map((teacher, index) => (
                <motion.div
                  key={teacher.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow text-center">
                    <CardHeader className="pb-4">
                      <Avatar className="h-24 w-24 mx-auto mb-4 bg-primary">
                        <AvatarImage src={teacher.photo_url || ''} />
                        <AvatarFallback className="text-primary-foreground text-2xl">
                          {teacher.name?.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-xl">{teacher.name}</CardTitle>
                      {getLocalizedField(teacher, 'designation') && (
                        <p className="text-sm text-primary font-medium">
                          {getLocalizedField(teacher, 'designation')}
                        </p>
                      )}
                      {teacher.is_featured && (
                        <Badge className="mx-auto mt-2 bg-primary/10 text-primary hover:bg-primary/20">Featured</Badge>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {getLocalizedField(teacher, 'specialization') && (
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          {getLocalizedField(teacher, 'specialization')}
                        </div>
                      )}
                      {getLocalizedField(teacher, 'bio') && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {getLocalizedField(teacher, 'bio')}
                        </p>
                      )}
                      <div className="flex items-center justify-center gap-4 pt-2">
                        {teacher.email && (
                          <a href={`mailto:${teacher.email}`} className="text-muted-foreground hover:text-primary">
                            <Mail className="h-4 w-4" />
                          </a>
                        )}
                        {teacher.phone && (
                          <a href={`tel:${teacher.phone}`} className="text-muted-foreground hover:text-primary">
                            <Phone className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <GraduationCap className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No teachers available yet.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Teachers;
