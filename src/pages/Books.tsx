import Layout from '@/components/layout/Layout';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLocalized } from '@/hooks/useLocalized';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

const Books = () => {
  const { t } = useTranslation();
  const { getLocalizedField } = useLocalized();

  const { data: books, isLoading } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t('books.title')}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('books.subtitle')}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted h-64 rounded-lg mb-4"></div>
                  <div className="bg-muted h-6 rounded w-3/4 mb-2"></div>
                  <div className="bg-muted h-4 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : books && books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {books.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {book.cover_image_url ? (
                    <img
                      src={book.cover_image_url}
                      alt={getLocalizedField(book, 'title')}
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <div className="w-full h-64 bg-muted flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-foreground mb-1">
                      {getLocalizedField(book, 'title')}
                    </h3>
                    {book.author && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {book.author}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {getLocalizedField(book, 'description')}
                    </p>
                    {book.price && (
                      <p className="text-primary font-semibold mt-2">
                        ৳{book.price}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No books available yet.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Books;
