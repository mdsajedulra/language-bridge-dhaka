import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLocalized } from '@/hooks/useLocalized';
import { Skeleton } from '@/components/ui/skeleton';

const Campus = () => {
  const { getLocalizedField } = useLocalized();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<any | null>(null);

  const { data: galleryImages, isLoading } = useQuery({
    queryKey: ['gallery-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const filteredImages = activeCategory === 'all' 
    ? galleryImages 
    : galleryImages?.filter(img => img.category === activeCategory);

  // Get unique categories from the data
  const availableCategories = galleryImages 
    ? ['all', ...new Set(galleryImages.map(img => img.category).filter(Boolean))]
    : ['all'];

  return (
    <Layout>
      <section className="py-20 bg-gradient-to-br from-foreground via-primary/90 to-foreground">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-background mb-6">
              Campus Life
            </h1>
            <p className="text-xl text-muted">
              Explore our vibrant campus and student activities
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container">
          {isLoading ? (
            <>
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-9 w-24 rounded-md" />
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Skeleton key={i} className="aspect-square rounded-xl" />
                ))}
              </div>
            </>
          ) : galleryImages && galleryImages.length > 0 ? (
            <>
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
                    {category === 'all' ? 'All' : category}
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
            </>
          ) : (
            <div className="text-center py-12">
              <span className="text-6xl block mb-4">📷</span>
              <p className="text-muted-foreground">No gallery images available yet.</p>
            </div>
          )}
        </div>
      </section>

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
    </Layout>
  );
};

export default Campus;
