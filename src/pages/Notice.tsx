import { motion } from 'framer-motion';
import { Calendar, Bell } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const notices = [
  {
    id: 1,
    title: 'New HSK-4 Batch Starting Soon',
    date: '2024-01-25',
    category: 'Course',
    description: 'Registration is now open for our upcoming HSK-4 preparation batch starting February 1st.',
    isNew: true,
  },
  {
    id: 2,
    title: 'Chinese New Year Celebration',
    date: '2024-01-20',
    category: 'Event',
    description: 'Join us for the Chinese New Year celebration at our campus. Cultural activities, food, and performances!',
    isNew: true,
  },
  {
    id: 3,
    title: 'Scholarship Announcement',
    date: '2024-01-15',
    category: 'Scholarship',
    description: '10 students have been selected for the China Government Scholarship 2024. Congratulations!',
    isNew: false,
  },
  {
    id: 4,
    title: 'Holiday Notice',
    date: '2024-01-10',
    category: 'Notice',
    description: 'The institute will remain closed from January 26-28 for national holidays.',
    isNew: false,
  },
];

const Notice = () => {
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
              Notice Board
            </h1>
            <p className="text-xl text-muted">
              Stay updated with the latest news and announcements
            </p>
          </motion.div>
        </div>
      </section>

      {/* Notices */}
      <section className="py-20 bg-background">
        <div className="container max-w-4xl">
          <div className="space-y-6">
            {notices.map((notice, index) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={notice.isNew ? 'default' : 'secondary'}>
                            {notice.category}
                          </Badge>
                          {notice.isNew && (
                            <Badge className="bg-accent text-accent-foreground">New</Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl">{notice.title}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                        <Calendar className="h-4 w-4" />
                        {notice.date}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {notice.description}
                    </CardDescription>
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

export default Notice;
