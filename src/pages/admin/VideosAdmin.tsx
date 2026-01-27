import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Play, Video } from 'lucide-react';

interface VideoItem {
  id: string;
  title_en: string;
  title_bn: string;
  title_zh: string;
  description_en: string | null;
  description_bn: string | null;
  description_zh: string | null;
  video_url: string;
  thumbnail_url: string | null;
  category: string | null;
  sort_order: number | null;
  is_active: boolean | null;
}

const defaultVideo: Partial<VideoItem> = {
  title_en: '',
  title_bn: '',
  title_zh: '',
  description_en: '',
  description_bn: '',
  description_zh: '',
  video_url: '',
  thumbnail_url: '',
  category: 'general',
  sort_order: 0,
  is_active: true,
};

const categories = ['general', 'tutorial', 'event', 'testimonial', 'campus'];

const VideosAdmin = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<VideoItem> | null>(null);
  const [formData, setFormData] = useState<Partial<VideoItem>>(defaultVideo);

  const { data: items, isLoading } = useQuery({
    queryKey: ['admin-videos'],
    queryFn: async () => {
      const { data, error } = await supabase.from('videos').select('*').order('sort_order');
      if (error) throw error;
      return data as VideoItem[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<VideoItem>) => {
      const { error } = await supabase.from('videos').insert([{
        title_en: data.title_en || '',
        title_bn: data.title_bn || '',
        title_zh: data.title_zh || '',
        description_en: data.description_en || null,
        description_bn: data.description_bn || null,
        description_zh: data.description_zh || null,
        video_url: data.video_url || '',
        thumbnail_url: data.thumbnail_url || null,
        category: data.category || 'general',
        sort_order: data.sort_order || 0,
        is_active: data.is_active ?? true,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      toast.success('Video created successfully');
      setIsDialogOpen(false);
      setFormData(defaultVideo);
    },
    onError: (error) => toast.error('Failed to create: ' + error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<VideoItem> }) => {
      const { error } = await supabase.from('videos').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      toast.success('Video updated successfully');
      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData(defaultVideo);
    },
    onError: (error) => toast.error('Failed to update: ' + error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('videos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      toast.success('Video deleted successfully');
    },
    onError: (error) => toast.error('Failed to delete: ' + error.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem?.id) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (item: VideoItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData(defaultVideo);
    setIsDialogOpen(true);
  };

  const getYouTubeThumbnail = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (match) return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
    return null;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Videos</h1>
            <p className="text-muted-foreground">Manage video content</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Add Video
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Video' : 'Add New Video'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Title (English)</Label>
                    <Input value={formData.title_en || ''} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Title (বাংলা)</Label>
                    <Input value={formData.title_bn || ''} onChange={(e) => setFormData({ ...formData, title_bn: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Title (中文)</Label>
                    <Input value={formData.title_zh || ''} onChange={(e) => setFormData({ ...formData, title_zh: e.target.value })} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Description (English)</Label>
                    <Textarea value={formData.description_en || ''} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} rows={3} />
                  </div>
                  <div>
                    <Label>Description (বাংলা)</Label>
                    <Textarea value={formData.description_bn || ''} onChange={(e) => setFormData({ ...formData, description_bn: e.target.value })} rows={3} />
                  </div>
                  <div>
                    <Label>Description (中文)</Label>
                    <Textarea value={formData.description_zh || ''} onChange={(e) => setFormData({ ...formData, description_zh: e.target.value })} rows={3} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Video URL (YouTube/Vimeo)</Label>
                    <Input value={formData.video_url || ''} onChange={(e) => setFormData({ ...formData, video_url: e.target.value })} placeholder="https://youtube.com/..." required />
                  </div>
                  <div>
                    <Label>Thumbnail URL (optional)</Label>
                    <Input value={formData.thumbnail_url || ''} onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })} placeholder="Auto-detected for YouTube" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select value={formData.category || 'general'} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Sort Order</Label>
                    <Input type="number" value={formData.sort_order || 0} onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch checked={formData.is_active || false} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
                    <Label>Active</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">{editingItem ? 'Update' : 'Create'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[1, 2, 3].map((i) => <div key={i} className="aspect-video bg-muted animate-pulse rounded-lg" />)}</div>
        ) : items && items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map((item) => {
              const thumbnail = item.thumbnail_url || getYouTubeThumbnail(item.video_url);
              return (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-video relative bg-muted">
                    {thumbnail ? (
                      <img src={thumbnail} alt={item.title_en} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Video className="h-12 w-12 text-muted-foreground" /></div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <a href={item.video_url} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                        <Play className="h-8 w-8 text-white fill-white" />
                      </a>
                    </div>
                    <div className="absolute top-2 left-2 flex gap-1">
                      <span className="px-2 py-0.5 rounded text-xs bg-blue-500/80 text-white">{item.category}</span>
                      {!item.is_active && <span className="px-2 py-0.5 rounded text-xs bg-gray-500/80 text-white">Hidden</span>}
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => deleteMutation.mutate(item.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <p className="text-sm font-medium truncate">{item.title_en}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.title_bn}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card><CardContent className="py-12 text-center text-muted-foreground flex flex-col items-center gap-2"><Video className="h-12 w-12" />No videos found. Click "Add Video" to add one.</CardContent></Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default VideosAdmin;
