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
import { Plus, Pencil, Trash2, Pin } from 'lucide-react';
import { format } from 'date-fns';

interface Notice {
  id: string;
  title_en: string;
  title_bn: string;
  title_zh: string;
  content_en: string | null;
  content_bn: string | null;
  content_zh: string | null;
  category: string | null;
  is_pinned: boolean | null;
  is_active: boolean | null;
  published_at: string | null;
}

const defaultNotice: Partial<Notice> = {
  title_en: '',
  title_bn: '',
  title_zh: '',
  content_en: '',
  content_bn: '',
  content_zh: '',
  category: 'general',
  is_pinned: false,
  is_active: true,
};

const categories = ['general', 'academic', 'event', 'exam', 'holiday', 'admission'];

const NoticesAdmin = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Notice> | null>(null);
  const [formData, setFormData] = useState<Partial<Notice>>(defaultNotice);

  const { data: items, isLoading } = useQuery({
    queryKey: ['admin-notices'],
    queryFn: async () => {
      const { data, error } = await supabase.from('notices').select('*').order('published_at', { ascending: false });
      if (error) throw error;
      return data as Notice[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Notice>) => {
      const { error } = await supabase.from('notices').insert([{
        title_en: data.title_en || '',
        title_bn: data.title_bn || '',
        title_zh: data.title_zh || '',
        content_en: data.content_en || null,
        content_bn: data.content_bn || null,
        content_zh: data.content_zh || null,
        category: data.category || 'general',
        is_pinned: data.is_pinned ?? false,
        is_active: data.is_active ?? true,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notices'] });
      toast.success('Notice created successfully');
      setIsDialogOpen(false);
      setFormData(defaultNotice);
    },
    onError: (error) => toast.error('Failed to create: ' + error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Notice> }) => {
      const { error } = await supabase.from('notices').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notices'] });
      toast.success('Notice updated successfully');
      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData(defaultNotice);
    },
    onError: (error) => toast.error('Failed to update: ' + error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('notices').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notices'] });
      toast.success('Notice deleted successfully');
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

  const handleEdit = (item: Notice) => {
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData(defaultNotice);
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notices</h1>
            <p className="text-muted-foreground">Manage announcements and notices</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Add Notice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Notice' : 'Add New Notice'}</DialogTitle>
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
                    <Label>Category</Label>
                    <Select value={formData.category || 'general'} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch checked={formData.is_pinned || false} onCheckedChange={(checked) => setFormData({ ...formData, is_pinned: checked })} />
                    <Label>Pinned</Label>
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
          <div className="grid gap-4">{[1, 2, 3].map((i) => <Card key={i} className="animate-pulse"><CardContent className="h-24" /></Card>)}</div>
        ) : items && items.length > 0 ? (
          <div className="grid gap-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    {item.is_pinned && <Pin className="h-4 w-4 text-accent" />}
                    <div>
                      <CardTitle className="text-lg">{item.title_en}</CardTitle>
                      <p className="text-sm text-muted-foreground">{item.title_bn} | {item.title_zh}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">{item.category}</span>
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
          <Card><CardContent className="py-12 text-center text-muted-foreground">No notices found. Click "Add Notice" to create one.</CardContent></Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default NoticesAdmin;
