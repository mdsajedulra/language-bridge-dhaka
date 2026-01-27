import { motion } from 'framer-motion';
import { Award, Clock, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const hskLevels = [
  {
    level: 'HSK 1',
    vocabulary: '150 words',
    skills: 'Basic greetings, numbers, simple phrases',
    duration: '60-80 hours',
    description: 'Can understand and use very simple Chinese phrases and sentences.',
  },
  {
    level: 'HSK 2',
    vocabulary: '300 words',
    skills: 'Daily topics, shopping, directions',
    duration: '120-160 hours',
    description: 'Can communicate in simple and routine tasks requiring direct exchange of information.',
  },
  {
    level: 'HSK 3',
    vocabulary: '600 words',
    skills: 'Travel, hobbies, opinions',
    duration: '240-320 hours',
    description: 'Can deal with most situations likely to arise while travelling in China.',
  },
  {
    level: 'HSK 4',
    vocabulary: '1200 words',
    skills: 'Abstract topics, news, culture',
    duration: '400-480 hours',
    description: 'Can discuss relatively complex subjects and communicate with native speakers.',
  },
  {
    level: 'HSK 5',
    vocabulary: '2500 words',
    skills: 'Academic, professional, literary',
    duration: '600-720 hours',
    description: 'Can read Chinese newspapers and magazines, enjoy Chinese films.',
  },
  {
    level: 'HSK 6',
    vocabulary: '5000+ words',
    skills: 'Full fluency, academic proficiency',
    duration: '800+ hours',
    description: 'Can easily comprehend written and spoken Chinese and express themselves fluently.',
  },
];

const HSK = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-foreground via-primary/90 to-foreground">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-background mb-6">
              HSK Exam Preparation
            </h1>
            <p className="text-xl text-muted">
              Everything you need to know about the Chinese Proficiency Test
            </p>
          </motion.div>
        </div>
      </section>

      {/* What is HSK */}
      <section className="py-16 bg-secondary">
        <div className="container max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Award className="h-16 w-16 mx-auto text-primary mb-6" />
            <h2 className="text-3xl font-bold mb-4">What is HSK?</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              HSK (Hanyu Shuiping Kaoshi) is the standardized Chinese proficiency test for non-native speakers. 
              It is recognized worldwide by universities, employers, and institutions as proof of Chinese language ability. 
              The test has 6 levels, from HSK 1 (beginner) to HSK 6 (advanced).
            </p>
          </motion.div>
        </div>
      </section>

      {/* HSK Levels */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">HSK Levels Explained</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hskLevels.map((level, index) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl text-primary">{level.level}</CardTitle>
                      <Badge variant="secondary">{level.vocabulary}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{level.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span>Skills: {level.skills}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>Study time: {level.duration}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Start Your HSK Journey</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Enroll in our HSK preparation courses and get certified!
            </p>
            <Button asChild size="lg" variant="secondary" className="text-lg">
              <Link to="/admission">
                Enroll Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default HSK;
