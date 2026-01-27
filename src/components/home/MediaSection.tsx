import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLocalized } from '@/hooks/useLocalized';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const MediaSection = () => {
  const { t } = useTranslation();
  const { getLocalizedField } = useLocalized();

  const { data: mediaArticles, isLoading } = useQuery({
    queryKey: ['media'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('is_active', true)
        .order('published_at', { ascending: false })
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!mediaArticles || mediaArticles.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('media.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('media.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mediaArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 group cursor-pointer">
                <CardHeader className="pb-2">
                  {article.image_url ? (
                    <img 
                      src={article.image_url} 
                      alt={getLocalizedField(article, 'title')}
                      className="h-32 w-full object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <div className="h-32 bg-secondary rounded-lg flex items-center justify-center text-5xl mb-4">
                      📰
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Calendar className="h-3 w-3" />
                    {article.published_at && format(new Date(article.published_at), 'yyyy-MM-dd')}
                    {article.source && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                        {article.source}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-base line-clamp-2">{getLocalizedField(article, 'title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {article.external_url ? (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                      asChild
                    >
                      <a href={article.external_url} target="_blank" rel="noopener noreferrer">
                        {t('media.readArticle')}
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                      {t('media.readArticle')}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaSection;
