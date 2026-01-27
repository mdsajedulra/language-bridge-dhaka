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
import { Plus, Pencil, Trash2, Star } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role_en: string | null;
  role_bn: string | null;
  role_zh: string | null;
  content_en: string;
  content_bn: string;
  content_zh: string;
  avatar_url: string | null;
  rating: number | null;
  is_active: boolean | null;
  sort_order: number | null;
}

const defaultTestimonial: Partial<Testimonial> = {
  name: '',
  role_en: '',
  role_bn: '',
  role_zh: '',
  content_en: '',
  content_bn: '',
  content_zh: '',
  avatar_url: '',
  rating: 5,
  is_active: true,
  sort_order: 0,
};

const TestimonialsAdmin = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Testimonial> | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>(defaultTestimonial);

  const { data: items, isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data as Testimonial[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Testimonial>) => {
      const { error } = await supabase.from('testimonials').insert([{
        name: data.name || '',
        role_en: data.role_en || null,
        role_bn: data.role_bn || null,
        role_zh: data.role_zh || null,
        content_en: data.content_en || '',
        content_bn: data.content_bn || '',
        content_zh: data.content_zh || '',
        avatar_url: data.avatar_url || null,
        rating: data.rating || 5,
        is_active: data.is_active ?? true,
        sort_order: data.sort_order || 0,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      toast.success('Testimonial created successfully');
      setIsDialogOpen(false);
      setFormData(defaultTestimonial);
    },
    onError: (error) => toast.error('Failed to create: ' + error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Testimonial> }) => {
      const { error } = await supabase.from('testimonials').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      toast.success('Testimonial updated successfully');
      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData(defaultTestimonial);
    },
    onError: (error) => toast.error('Failed to update: ' + error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      toast.success('Testimonial deleted successfully');
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

  const handleEdit = (item: Testimonial) => {
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData(defaultTestimonial);
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Testimonials</h1>
            <p className="text-muted-foreground">Manage student testimonials</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Add Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Avatar URL</Label>
                    <Input value={formData.avatar_url || ''} onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })} placeholder="https://..." />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Role (English)</Label>
                    <Input value={formData.role_en || ''} onChange={(e) => setFormData({ ...formData, role_en: e.target.value })} placeholder="e.g., Student" />
                  </div>
                  <div>
                    <Label>Role (বাংলা)</Label>
                    <Input value={formData.role_bn || ''} onChange={(e) => setFormData({ ...formData, role_bn: e.target.value })} placeholder="e.g., শিক্ষার্থী" />
                  </div>
                  <div>
                    <Label>Role (中文)</Label>
                    <Input value={formData.role_zh || ''} onChange={(e) => setFormData({ ...formData, role_zh: e.target.value })} placeholder="e.g., 学生" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Content (English)</Label>
                    <Textarea value={formData.content_en || ''} onChange={(e) => setFormData({ ...formData, content_en: e.target.value })} rows={4} required />
                  </div>
                  <div>
                    <Label>Content (বাংলা)</Label>
                    <Textarea value={formData.content_bn || ''} onChange={(e) => setFormData({ ...formData, content_bn: e.target.value })} rows={4} required />
                  </div>
                  <div>
                    <Label>Content (中文)</Label>
                    <Textarea value={formData.content_zh || ''} onChange={(e) => setFormData({ ...formData, content_zh: e.target.value })} rows={4} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Rating (1-5)</Label>
                    <Input type="number" min="1" max="5" value={formData.rating || 5} onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })} />
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
          <div className="grid gap-4">{[1, 2, 3].map((i) => <Card key={i} className="animate-pulse"><CardContent className="h-24" /></Card>)}</div>
        ) : items && items.length > 0 ? (
          <div className="grid gap-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-3">
                    {item.avatar_url && <img src={item.avatar_url} alt={item.name} className="w-12 h-12 rounded-full object-cover" />}
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{item.role_en}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">{Array.from({ length: item.rating || 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}</div>
                    <span className={`px-2 py-1 rounded-full text-xs ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteMutation.mutate(item.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.content_en}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No testimonials found. Click "Add Testimonial" to create one.</CardContent></Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default TestimonialsAdmin;
