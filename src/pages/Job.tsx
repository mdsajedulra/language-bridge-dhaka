import { motion } from 'framer-motion';
import { Briefcase, MapPin, ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLocalized } from '@/hooks/useLocalized';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const Job = () => {
  const { getLocalizedField } = useLocalized();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
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
              Career Opportunities
            </h1>
            <p className="text-xl text-muted">
              Find exciting job opportunities for Chinese language speakers
            </p>
          </motion.div>
        </div>
      </section>

      {/* Jobs */}
      <section className="py-20 bg-background">
        <div className="container max-w-4xl">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </div>
          ) : jobs && jobs.length > 0 ? (
            <div className="space-y-6">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">{job.job_type || 'Full-time'}</Badge>
                            {job.deadline && new Date(job.deadline) > new Date() && (
                              <Badge className="bg-accent text-accent-foreground">Open</Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl">{getLocalizedField(job, 'title')}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {getLocalizedField(job, 'location') && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {getLocalizedField(job, 'location')}
                          </div>
                        )}
                        {job.salary_range && (
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {job.salary_range}
                          </div>
                        )}
                        {job.deadline && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Deadline: {format(new Date(job.deadline), 'MMM dd, yyyy')}
                          </div>
                        )}
                      </div>
                      <p className="text-muted-foreground">{getLocalizedField(job, 'description')}</p>
                    </CardContent>
                    <CardFooter>
                      <Button className="bg-primary hover:bg-primary/90">
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No job openings available at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Job;
