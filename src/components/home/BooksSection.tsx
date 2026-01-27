import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLocalized } from '@/hooks/useLocalized';
import { Skeleton } from '@/components/ui/skeleton';

const BooksSection = () => {
  const { t } = useTranslation();
  const { getLocalizedField } = useLocalized();

  const { data: books, isLoading } = useQuery({
    queryKey: ['books-featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-secondary">
        <div className="container">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!books || books.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-secondary">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('books.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('books.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 group cursor-pointer">
                <CardHeader className="text-center pb-2">
                  {book.cover_image_url ? (
                    <img 
                      src={book.cover_image_url} 
                      alt={getLocalizedField(book, 'title')}
                      className="h-40 w-auto mx-auto mb-4 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="text-6xl mb-4">📚</div>
                  )}
                  <CardTitle className="text-lg">{getLocalizedField(book, 'title')}</CardTitle>
                  {book.author && (
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground text-center line-clamp-2">
                    {getLocalizedField(book, 'description')}
                  </CardDescription>
                  {book.price && (
                    <p className="text-primary font-semibold text-center mt-2">৳{book.price}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button asChild variant="outline" size="lg">
            <Link to="/books">
              <BookOpen className="mr-2 h-5 w-5" />
              {t('books.viewAll')}
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default BooksSection;
