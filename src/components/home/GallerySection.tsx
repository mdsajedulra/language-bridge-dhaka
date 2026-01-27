import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLocalized } from '@/hooks/useLocalized';
import { Skeleton } from '@/components/ui/skeleton';

const categories = ['all', 'classroom', 'students', 'events', 'campus', 'general'] as const;

const GallerySection = () => {
  const { t } = useTranslation();
  const { getLocalizedField } = useLocalized();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<any | null>(null);

  const { data: galleryImages, isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
        .limit(8);
      if (error) throw error;
      return data;
    },
  });

  const filteredImages = activeCategory === 'all' 
    ? galleryImages 
    : galleryImages?.filter(img => img.category === activeCategory);

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!galleryImages || galleryImages.length === 0) {
    return null;
  }

  // Get unique categories from the data
  const availableCategories = ['all', ...new Set(galleryImages.map(img => img.category).filter(Boolean))];

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
            {t('gallery.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('gallery.subtitle')}
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {availableCategories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(category as string)}
              className={cn(
                activeCategory === category && 'bg-primary text-primary-foreground'
              )}
            >
              {category === 'all' ? t('gallery.categories.all') : category}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredImages?.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedImage(image)}
                className="aspect-square bg-secondary rounded-xl overflow-hidden cursor-pointer group hover:shadow-lg transition-all"
              >
                {image.image_url ? (
                  <img 
                    src={image.image_url} 
                    alt={getLocalizedField(image, 'title') || 'Gallery image'}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center p-4 group-hover:bg-primary/10 transition-colors">
                    <span className="text-5xl mb-2 group-hover:scale-110 transition-transform">
                      📷
                    </span>
                    <span className="text-sm text-muted-foreground text-center">
                      {getLocalizedField(image, 'title') || 'Image'}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link to="/campus">
              {t('gallery.viewAll')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/10"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-4xl max-h-[80vh] overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedImage.image_url ? (
                <img 
                  src={selectedImage.image_url} 
                  alt={getLocalizedField(selectedImage, 'title') || 'Gallery image'}
                  className="max-w-full max-h-[80vh] object-contain"
                />
              ) : (
                <div className="bg-secondary rounded-2xl p-12 text-center">
                  <span className="text-9xl block mb-4">📷</span>
                  <h3 className="text-2xl font-bold text-foreground">{getLocalizedField(selectedImage, 'title')}</h3>
                  <p className="text-muted-foreground mt-2 capitalize">{selectedImage.category}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
