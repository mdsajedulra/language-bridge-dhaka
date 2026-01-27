import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const books = [
  {
    id: 1,
    title: 'Basic Chinese for Beginners',
    titleBn: 'শিক্ষানবিসদের জন্য বেসিক চাইনিজ',
    titleZh: '初级汉语基础',
    description: 'A comprehensive guide for starting your Chinese language journey with essential vocabulary and grammar.',
    cover: '📕',
  },
  {
    id: 2,
    title: 'HSK Vocabulary Guide',
    titleBn: 'এইচএসকে শব্দভাণ্ডার গাইড',
    titleZh: 'HSK词汇指南',
    description: 'Complete vocabulary lists for HSK levels 1-4 with examples and practice exercises.',
    cover: '📗',
  },
  {
    id: 3,
    title: 'Chinese Characters Workbook',
    titleBn: 'চাইনিজ অক্ষর ওয়ার্কবুক',
    titleZh: '汉字练习册',
    description: 'Practice writing Chinese characters with stroke order guides and worksheets.',
    cover: '📘',
  },
  {
    id: 4,
    title: 'Business Chinese',
    titleBn: 'বিজনেস চাইনিজ',
    titleZh: '商务汉语',
    description: 'Professional Chinese language skills for business communication and workplace scenarios.',
    cover: '📙',
  },
];

const BooksSection = () => {
  const { t, i18n } = useTranslation();

  const getLocalizedTitle = (book: typeof books[0]) => {
    switch (i18n.language) {
      case 'bn': return book.titleBn;
      case 'zh': return book.titleZh;
      default: return book.title;
    }
  };

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
                  <div className="text-6xl mb-4">{book.cover}</div>
                  <CardTitle className="text-lg">{getLocalizedTitle(book)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground text-center">
                    {book.description}
                  </CardDescription>
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
            <Link to="/courses">
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
