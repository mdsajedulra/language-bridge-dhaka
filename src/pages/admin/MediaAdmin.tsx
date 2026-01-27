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
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface Media {
  id: string;
  title_en: string;
  title_bn: string;
  title_zh: string;
  content_en: string | null;
  content_bn: string | null;
  content_zh: string | null;
  image_url: string | null;
  external_url: string | null;
  source: string | null;
  published_at: string | null;
  is_active: boolean | null;
}

const defaultMedia: Partial<Media> = {
  title_en: '',
  title_bn: '',
  title_zh: '',
  content_en: '',
  content_bn: '',
  content_zh: '',
  image_url: '',
  external_url: '',
  source: '',
  is_active: true,
};

const MediaAdmin = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Media> | null>(null);
  const [formData, setFormData] = useState<Partial<Media>>(defaultMedia);

  const { data: items, isLoading } = useQuery({
    queryKey: ['admin-media'],
    queryFn: async () => {
      const { data, error } = await supabase.from('media').select('*').order('published_at', { ascending: false });
      if (error) throw error;
      return data as Media[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Media>) => {
      const { error } = await supabase.from('media').insert([{
        title_en: data.title_en || '',
        title_bn: data.title_bn || '',
        title_zh: data.title_zh || '',
        content_en: data.content_en || null,
        content_bn: data.content_bn || null,
        content_zh: data.content_zh || null,
        image_url: data.image_url || null,
        external_url: data.external_url || null,
        source: data.source || null,
        is_active: data.is_active ?? true,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-media'] });
      toast.success('Media created successfully');
      setIsDialogOpen(false);
      setFormData(defaultMedia);
    },
    onError: (error) => toast.error('Failed to create: ' + error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Media> }) => {
      const { error } = await supabase.from('media').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-media'] });
      toast.success('Media updated successfully');
      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData(defaultMedia);
    },
    onError: (error) => toast.error('Failed to update: ' + error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('media').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-media'] });
      toast.success('Media deleted successfully');
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

  const handleEdit = (item: Media) => {
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData(defaultMedia);
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Media & News</h1>
            <p className="text-muted-foreground">Manage news and media coverage</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Add Media
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Media' : 'Add New Media'}</DialogTitle>
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
                    <Label>Content (English)</Label>
                    <Textarea value={formData.content_en || ''} onChange={(e) => setFormData({ ...formData, content_en: e.target.value })} rows={4} />
                  </div>
                  <div>
                    <Label>Content (বাংলা)</Label>
                    <Textarea value={formData.content_bn || ''} onChange={(e) => setFormData({ ...formData, content_bn: e.target.value })} rows={4} />
                  </div>
                  <div>
                    <Label>Content (中文)</Label>
                    <Textarea value={formData.content_zh || ''} onChange={(e) => setFormData({ ...formData, content_zh: e.target.value })} rows={4} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Image URL</Label>
                    <Input value={formData.image_url || ''} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://..." />
                  </div>
                  <div>
                    <Label>External URL</Label>
                    <Input value={formData.external_url || ''} onChange={(e) => setFormData({ ...formData, external_url: e.target.value })} placeholder="https://..." />
                  </div>
                  <div>
                    <Label>Source</Label>
                    <Input value={formData.source || ''} onChange={(e) => setFormData({ ...formData, source: e.target.value })} placeholder="e.g., Daily Star" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch checked={formData.is_active || false} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
                  <Label>Active</Label>
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
          <div className="grid gap-4">{[1, 2, 3].map((i) => <Card key={i} className="animate-pulse"><CardContent className="h-24" /></Card>)}</div>
        ) : items && items.length > 0 ? (
          <div className="grid gap-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-3">
                    {item.image_url && <img src={item.image_url} alt={item.title_en} className="w-16 h-16 rounded object-cover" />}
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {item.title_en}
                        {item.external_url && <a href={item.external_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4 text-muted-foreground" /></a>}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{item.title_bn} | {item.title_zh}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.source && <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">{item.source}</span>}
                    <span className={`px-2 py-1 rounded-full text-xs ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteMutation.mutate(item.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.content_en}</p>
                  {item.published_at && <p className="text-xs text-muted-foreground mt-2">Published: {format(new Date(item.published_at), 'PPP')}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No media found. Click "Add Media" to create one.</CardContent></Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default MediaAdmin;
