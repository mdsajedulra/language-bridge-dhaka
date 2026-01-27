import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, MapPin, Quote } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const alumni = [
  {
    id: 1,
    name: 'Md. Rahman Chowdhury',
    batch: '2018',
    currentRole: 'Translator at BGMEA',
    location: 'Dhaka',
    quote: 'The training at Yidai Yilu opened doors I never knew existed. Now I work with Chinese textile buyers daily.',
    achievement: 'HSK-5 Certified',
  },
  {
    id: 2,
    name: 'Fatima Akter',
    batch: '2019',
    currentRole: 'Studying at Peking University',
    location: 'Beijing, China',
    quote: 'Thanks to the scholarship guidance from the institute, I am now pursuing my Master\'s in China.',
    achievement: 'CSC Scholarship Recipient',
  },
  {
    id: 3,
    name: 'Ahmed Hassan',
    batch: '2020',
    currentRole: 'Business Development Manager',
    location: 'Dhaka',
    quote: 'Learning Chinese helped me get promoted twice in just two years. Best investment I ever made.',
    achievement: 'HSK-4 Certified',
  },
  {
    id: 4,
    name: 'Nusrat Jahan',
    batch: '2021',
    currentRole: 'Chinese Teacher',
    location: 'Chattogram',
    quote: 'I came here as a student, and now I teach others. The journey has been incredible.',
    achievement: 'HSK-5 Certified',
  },
];

const Alumni = () => {
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
              Our Alumni
            </h1>
            <p className="text-xl text-muted">
              Success stories from our graduates around the world
            </p>
          </motion.div>
        </div>
      </section>

      {/* Alumni Grid */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            {alumni.map((person, index) => (
              <motion.div
                key={person.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16 bg-primary">
                        <AvatarFallback className="text-primary-foreground text-xl">
                          {person.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl">{person.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <GraduationCap className="h-4 w-4" />
                          Batch {person.batch}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        {person.currentRole}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {person.location}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Quote className="h-5 w-5 text-primary shrink-0 mt-1" />
                      <p className="text-muted-foreground italic">"{person.quote}"</p>
                    </div>
                    <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {person.achievement}
                    </div>
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

export default Alumni;
