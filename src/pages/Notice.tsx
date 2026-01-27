import { motion } from 'framer-motion';
import { Calendar, Bell } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLocalized } from '@/hooks/useLocalized';
import { Skeleton } from '@/components/ui/skeleton';
import { format, isAfter, subDays } from 'date-fns';

const Notice = () => {
  const { getLocalizedField } = useLocalized();

  const { data: notices, isLoading } = useQuery({
    queryKey: ['notices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('is_active', true)
        .order('is_pinned', { ascending: false })
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const isNew = (dateStr: string | null) => {
    if (!dateStr) return false;
    return isAfter(new Date(dateStr), subDays(new Date(), 7));
  };

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
              Notice Board
            </h1>
            <p className="text-xl text-muted">
              Stay updated with the latest news and announcements
            </p>
          </motion.div>
        </div>
      </section>

      {/* Notices */}
      <section className="py-20 bg-background">
        <div className="container max-w-4xl">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
            </div>
          ) : notices && notices.length > 0 ? (
            <div className="space-y-6">
              {notices.map((notice, index) => (
                <motion.div
                  key={notice.id}
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
                            <Badge variant={notice.is_pinned ? 'default' : 'secondary'}>
                              {notice.category || 'General'}
                            </Badge>
                            {isNew(notice.published_at) && (
                              <Badge className="bg-accent text-accent-foreground">New</Badge>
                            )}
                            {notice.is_pinned && (
                              <Badge variant="outline">📌 Pinned</Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl">{getLocalizedField(notice, 'title')}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                          <Calendar className="h-4 w-4" />
                          {notice.published_at && format(new Date(notice.published_at), 'yyyy-MM-dd')}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {getLocalizedField(notice, 'content')}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No notices available yet.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Notice;
