import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';

const videos = [
  { id: 1, title: 'Chinese Pronunciation Basics', duration: '10:30', emoji: '🗣️' },
  { id: 2, title: 'HSK 1 Vocabulary', duration: '15:45', emoji: '📚' },
  { id: 3, title: 'Chinese Characters Writing', duration: '12:20', emoji: '✍️' },
  { id: 4, title: 'Daily Conversations', duration: '8:15', emoji: '💬' },
  { id: 5, title: 'Chinese Culture Introduction', duration: '20:00', emoji: '🏮' },
  { id: 6, title: 'Business Chinese', duration: '18:30', emoji: '💼' },
];

const Videos = () => {
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
              Chinese Video Library
            </h1>
            <p className="text-xl text-muted">
              Learn Chinese with our educational video content
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
                  <div className="aspect-video bg-secondary flex items-center justify-center relative">
                    <span className="text-6xl">{video.emoji}</span>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="h-16 w-16 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{video.title}</h3>
                    <p className="text-sm text-muted-foreground">{video.duration}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Videos;
