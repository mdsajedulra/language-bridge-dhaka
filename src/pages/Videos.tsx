import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLocalized } from '@/hooks/useLocalized';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const Videos = () => {
  const { getLocalizedField } = useLocalized();
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);

  const { data: videos, isLoading } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
  };

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
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="aspect-video rounded-xl" />
              ))}
            </div>
          ) : videos && videos.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="aspect-video bg-secondary flex items-center justify-center relative">
                      {video.thumbnail_url ? (
                        <img 
                          src={video.thumbnail_url} 
                          alt={getLocalizedField(video, 'title')}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-6xl">🎬</span>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="h-16 w-16 text-white" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{getLocalizedField(video, 'title')}</h3>
                      {video.category && (
                        <p className="text-sm text-muted-foreground capitalize">{video.category}</p>
                      )}
                      {getLocalizedField(video, 'description') && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {getLocalizedField(video, 'description')}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Play className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No videos available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Video Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl p-0">
          {selectedVideo && (
            <div className="aspect-video">
              <iframe
                src={getYouTubeEmbedUrl(selectedVideo.video_url)}
                title={getLocalizedField(selectedVideo, 'title')}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Videos;
