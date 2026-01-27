import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const galleryImages = [
  { id: 1, category: 'classroom', emoji: '📚', title: 'Interactive Learning' },
  { id: 2, category: 'students', emoji: '👨‍🎓', title: 'Student Life' },
  { id: 3, category: 'events', emoji: '🎉', title: 'Cultural Festival' },
  { id: 4, category: 'campus', emoji: '🏫', title: 'Campus View' },
  { id: 5, category: 'classroom', emoji: '✍️', title: 'Writing Practice' },
  { id: 6, category: 'students', emoji: '🎓', title: 'Graduation Day' },
  { id: 7, category: 'events', emoji: '🐲', title: 'Chinese New Year' },
  { id: 8, category: 'campus', emoji: '📖', title: 'Library' },
];

const categories = ['all', 'classroom', 'students', 'events', 'campus'] as const;

const GallerySection = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);

  const filteredImages = activeCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

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
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className={cn(
                activeCategory === category && 'bg-primary text-primary-foreground'
              )}
            >
              {t(`gallery.categories.${category}`)}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
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
                <div className="h-full w-full flex flex-col items-center justify-center p-4 group-hover:bg-primary/10 transition-colors">
                  <span className="text-5xl mb-2 group-hover:scale-110 transition-transform">
                    {image.emoji}
                  </span>
                  <span className="text-sm text-muted-foreground text-center">
                    {image.title}
                  </span>
                </div>
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
              className="bg-secondary rounded-2xl p-12 text-center max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-9xl block mb-4">{selectedImage.emoji}</span>
              <h3 className="text-2xl font-bold text-foreground">{selectedImage.title}</h3>
              <p className="text-muted-foreground mt-2 capitalize">{selectedImage.category}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
