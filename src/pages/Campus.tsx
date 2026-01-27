import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import GallerySection from '@/components/home/GallerySection';

const Campus = () => {
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
      <GallerySection />
    </Layout>
  );
};

export default Campus;
