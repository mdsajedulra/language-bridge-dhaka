import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const jobs = [
  {
    id: 1,
    title: 'Chinese Language Teacher',
    company: 'Yidai Yilu Chinese Institute',
    location: 'Dhaka',
    type: 'Full-time',
    salary: 'Negotiable',
    description: 'We are looking for experienced Chinese language teachers with HSK-5 or above certification.',
    requirements: ['HSK-5 or above', '2+ years teaching experience', 'Native/fluent speaker'],
    isNew: true,
  },
  {
    id: 2,
    title: 'Translator (Chinese-Bangla-English)',
    company: 'China Bangladesh Trade Company',
    location: 'Dhaka',
    type: 'Full-time',
    salary: 'BDT 50,000 - 80,000',
    description: 'Looking for trilingual translators for business documentation and meetings.',
    requirements: ['HSK-4 or above', 'Fluent in Bangla & English', 'Business translation experience'],
    isNew: true,
  },
  {
    id: 3,
    title: 'Customer Service Representative',
    company: 'Chinese Electronics Company',
    location: 'Chittagong',
    type: 'Full-time',
    salary: 'BDT 30,000 - 45,000',
    description: 'Handle customer inquiries in Chinese and Bangla for our electronics import business.',
    requirements: ['HSK-3 or above', 'Good communication skills', 'Computer proficiency'],
    isNew: false,
  },
];

const Job = () => {
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
              Career Opportunities
            </h1>
            <p className="text-xl text-muted">
              Find exciting job opportunities for Chinese language speakers
            </p>
          </motion.div>
        </div>
      </section>

      {/* Jobs */}
      <section className="py-20 bg-background">
        <div className="container max-w-4xl">
          <div className="space-y-6">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
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
                          <Badge variant="secondary">{job.type}</Badge>
                          {job.isNew && (
                            <Badge className="bg-accent text-accent-foreground">New</Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <CardDescription className="text-base mt-1">
                          {job.company}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {job.salary}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{job.description}</p>
                    <div>
                      <p className="font-medium mb-2">Requirements:</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {job.requirements.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="bg-primary hover:bg-primary/90">
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Job;
