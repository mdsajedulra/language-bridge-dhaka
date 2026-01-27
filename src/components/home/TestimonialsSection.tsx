import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    id: 1,
    name: 'Rahim Ahmed',
    nameBn: 'রহিম আহমেদ',
    nameZh: '拉希姆·艾哈迈德',
    role: 'HSK-4 Graduate',
    rating: 5,
    quote: 'Family-like environment, best Chinese learning academy in Bangladesh. The teachers are incredibly supportive.',
    quoteBn: 'পারিবারিক পরিবেশ, বাংলাদেশের সেরা চীনা শিক্ষা একাডেমি। শিক্ষকরা অবিশ্বাস্যভাবে সহায়ক।',
    quoteZh: '家庭般的环境，是孟加拉国最好的中文学习学院。老师们非常支持。',
    avatar: '',
  },
  {
    id: 2,
    name: 'Fatima Khan',
    nameBn: 'ফাতিমা খান',
    nameZh: '法蒂玛·汗',
    role: 'Working Professional',
    rating: 5,
    quote: 'Best institute in Bangladesh for Chinese language learning. The evening classes fit perfectly with my work schedule.',
    quoteBn: 'চীনা ভাষা শেখার জন্য বাংলাদেশের সেরা প্রতিষ্ঠান। সন্ধ্যার ক্লাসগুলো আমার কাজের সময়সূচীর সাথে পুরোপুরি মানানসই।',
    quoteZh: '孟加拉国最好的中文学习机构。晚间课程完全符合我的工作时间安排。',
    avatar: '',
  },
  {
    id: 3,
    name: 'Mohammad Hasan',
    nameBn: 'মোহাম্মদ হাসান',
    nameZh: '穆罕默德·哈桑',
    role: 'University Student',
    rating: 5,
    quote: 'Within 4 months I passed HSK-3 with good scores. The teaching methods are very effective and practical.',
    quoteBn: '৪ মাসের মধ্যে আমি ভালো স্কোর নিয়ে HSK-3 পাস করেছি। শিক্ষাদান পদ্ধতি খুবই কার্যকর এবং ব্যবহারিক।',
    quoteZh: '4个月内我以优异的成绩通过了HSK-3。教学方法非常有效和实用。',
    avatar: '',
  },
  {
    id: 4,
    name: 'Aisha Begum',
    nameBn: 'আয়েশা বেগম',
    nameZh: '阿伊莎·贝古姆',
    role: 'Scholarship Recipient',
    rating: 5,
    quote: 'Thanks to Yidai Yilu, I got a scholarship to study in China. Their guidance throughout the process was invaluable.',
    quoteBn: 'ইদাই ইলুর জন্য ধন্যবাদ, আমি চীনে পড়াশোনার জন্য বৃত্তি পেয়েছি। পুরো প্রক্রিয়া জুড়ে তাদের নির্দেশনা অমূল্য ছিল।',
    quoteZh: '感谢一带一路，我获得了赴华留学的奖学金。他们在整个过程中的指导非常宝贵。',
    avatar: '',
  },
];

const TestimonialsSection = () => {
  const { t, i18n } = useTranslation();

  const getLocalizedName = (testimonial: typeof testimonials[0]) => {
    switch (i18n.language) {
      case 'bn': return testimonial.nameBn;
      case 'zh': return testimonial.nameZh;
      default: return testimonial.name;
    }
  };

  const getLocalizedQuote = (testimonial: typeof testimonials[0]) => {
    switch (i18n.language) {
      case 'bn': return testimonial.quoteBn;
      case 'zh': return testimonial.quoteZh;
      default: return testimonial.quote;
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
            {t('testimonials.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Quote className="h-8 w-8 text-primary shrink-0" />
                    <div className="space-y-4">
                      <p className="text-muted-foreground italic leading-relaxed">
                        "{getLocalizedQuote(testimonial)}"
                      </p>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 bg-primary/10">
                          <AvatarImage src={testimonial.avatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-foreground">
                            {getLocalizedName(testimonial)}
                          </div>
                          <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                        </div>
                        <div className="ml-auto flex gap-0.5">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-brand-gold text-brand-gold" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
