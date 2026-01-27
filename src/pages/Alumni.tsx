import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, MapPin, Quote } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLocalized } from '@/hooks/useLocalized';
import { Skeleton } from '@/components/ui/skeleton';

const Alumni = () => {
  const { getLocalizedField } = useLocalized();

  const { data: alumni, isLoading } = useQuery({
    queryKey: ['alumni'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alumni')
        .select('*')
        .eq('is_active', true)
        .order('batch_year', { ascending: false });
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
              Our Alumni
            </h1>
            <p className="text-xl text-muted">
              Success stories from our graduates around the world
            </p>
          </motion.div>
        </div>
      </section>

      {/* Alumni Grid */}
      <section className="py-20 bg-background">
        <div className="container">
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          ) : alumni && alumni.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {alumni.map((person, index) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16 bg-primary">
                          <AvatarImage src={person.photo_url || ''} />
                          <AvatarFallback className="text-primary-foreground text-xl">
                            {person.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl">{person.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <GraduationCap className="h-4 w-4" />
                            Batch {person.batch_year}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-4 text-sm">
                        {getLocalizedField(person, 'current_position') && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Briefcase className="h-4 w-4" />
                            {getLocalizedField(person, 'current_position')}
                          </div>
                        )}
                        {person.company && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {person.company}
                          </div>
                        )}
                      </div>
                      {getLocalizedField(person, 'story') && (
                        <div className="flex gap-3">
                          <Quote className="h-5 w-5 text-primary shrink-0 mt-1" />
                          <p className="text-muted-foreground italic">"{getLocalizedField(person, 'story')}"</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <GraduationCap className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No alumni stories available yet.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Alumni;
