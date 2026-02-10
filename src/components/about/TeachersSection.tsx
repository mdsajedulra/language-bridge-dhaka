import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLocalized } from '@/hooks/useLocalized';
import { Skeleton } from '@/components/ui/skeleton';

const TeachersSection = () => {
  const { getLocalizedField } = useLocalized();

  const { data: teachers, isLoading } = useQuery({
    queryKey: ['featured-teachers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teachers' as any)
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('sort_order', { ascending: true })
        .limit(6);
      if (error) throw error;
      return data as any[];
    },
  });

  if (!isLoading && (!teachers || teachers.length === 0)) return null;

  return (
    <section className="py-20 bg-secondary">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">Our Teachers</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet our expert language instructors who are dedicated to your success
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachers?.map((teacher, index) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center p-6">
                  <CardContent className="pt-0 space-y-4">
                    <Avatar className="h-20 w-20 mx-auto bg-primary">
                      <AvatarImage src={teacher.photo_url || ''} />
                      <AvatarFallback className="text-primary-foreground text-xl">
                        {teacher.name?.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{teacher.name}</h3>
                      {getLocalizedField(teacher, 'designation') && (
                        <p className="text-sm text-primary font-medium">{getLocalizedField(teacher, 'designation')}</p>
                      )}
                    </div>
                    {getLocalizedField(teacher, 'specialization') && (
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        {getLocalizedField(teacher, 'specialization')}
                      </div>
                    )}
                    {getLocalizedField(teacher, 'bio') && (
                      <p className="text-sm text-muted-foreground line-clamp-3">{getLocalizedField(teacher, 'bio')}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/teachers">
            <Button variant="outline" size="lg">
              View All Teachers →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TeachersSection;
