import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const mediaArticles = [
  {
    id: 1,
    title: 'Bangladesh-China Development Partnership Strengthens',
    titleBn: 'বাংলাদেশ-চীন উন্নয়ন অংশীদারিত্ব শক্তিশালী হচ্ছে',
    titleZh: '孟中发展伙伴关系加强',
    source: 'The Daily Star',
    date: '2024-01-15',
    image: '📰',
  },
  {
    id: 2,
    title: 'Chinese Language Research Achievements Recognized',
    titleBn: 'চীনা ভাষা গবেষণা অর্জন স্বীকৃত',
    titleZh: '汉语研究成果获认可',
    source: 'Prothom Alo',
    date: '2024-02-20',
    image: '📰',
  },
  {
    id: 3,
    title: 'Chinese National Day Celebrated at Yidai Yilu',
    titleBn: 'ইদাই ইলুতে চীনের জাতীয় দিবস উদযাপন',
    titleZh: '一带一路学院庆祝中国国庆',
    source: 'Bangladesh Post',
    date: '2023-10-01',
    image: '📰',
  },
  {
    id: 4,
    title: 'Students Receive Scholarships for Chinese Universities',
    titleBn: 'শিক্ষার্থীরা চীনা বিশ্ববিদ্যালয়ের জন্য বৃত্তি পেয়েছেন',
    titleZh: '学生获得中国大学奖学金',
    source: 'Dhaka Tribune',
    date: '2024-03-10',
    image: '📰',
  },
];

const MediaSection = () => {
  const { t, i18n } = useTranslation();

  const getLocalizedTitle = (article: typeof mediaArticles[0]) => {
    switch (i18n.language) {
      case 'bn': return article.titleBn;
      case 'zh': return article.titleZh;
      default: return article.title;
    }
  };

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
                  <div className="h-32 bg-secondary rounded-lg flex items-center justify-center text-5xl mb-4">
                    {article.image}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Calendar className="h-3 w-3" />
                    {article.date}
                    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                      {article.source}
                    </span>
                  </div>
                  <CardTitle className="text-base line-clamp-2">{getLocalizedTitle(article)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                    {t('media.readArticle')}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
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
