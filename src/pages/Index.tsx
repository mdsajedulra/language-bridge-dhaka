import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import CoursesSection from '@/components/home/CoursesSection';
import AboutSection from '@/components/home/AboutSection';
import ServicesSection from '@/components/home/ServicesSection';
import BooksSection from '@/components/home/BooksSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import MediaSection from '@/components/home/MediaSection';
import PartnersSection from '@/components/home/PartnersSection';
import GallerySection from '@/components/home/GallerySection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <CoursesSection />
      <AboutSection />
      <ServicesSection />
      <BooksSection />
      <TestimonialsSection />
      <MediaSection />
      <PartnersSection />
      <GallerySection />
    </Layout>
  );
};

export default Index;
