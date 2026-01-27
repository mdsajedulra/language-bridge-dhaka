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
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Service {
  id: string;
  title_en: string;
  title_bn: string;
  title_zh: string;
  description_en: string | null;
  description_bn: string | null;
  description_zh: string | null;
  icon: string | null;
  sort_order: number | null;
  is_active: boolean | null;
}

const defaultService: Partial<Service> = {
  title_en: '',
  title_bn: '',
  title_zh: '',
  description_en: '',
  description_bn: '',
  description_zh: '',
  icon: 'Star',
  sort_order: 0,
  is_active: true,
};

const ServicesAdmin = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Service> | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>(defaultService);

  const { data: items, isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: async () => {
      const { data, error } = await supabase.from('services').select('*').order('sort_order');
      if (error) throw error;
      return data as Service[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Service>) => {
      const { error } = await supabase.from('services').insert([{
        title_en: data.title_en || '',
        title_bn: data.title_bn || '',
        title_zh: data.title_zh || '',
        description_en: data.description_en || null,
        description_bn: data.description_bn || null,
        description_zh: data.description_zh || null,
        icon: data.icon || 'Star',
        sort_order: data.sort_order || 0,
        is_active: data.is_active ?? true,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success('Service created successfully');
      setIsDialogOpen(false);
      setFormData(defaultService);
    },
    onError: (error) => toast.error('Failed to create: ' + error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Service> }) => {
      const { error } = await supabase.from('services').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success('Service updated successfully');
      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData(defaultService);
    },
    onError: (error) => toast.error('Failed to update: ' + error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success('Service deleted successfully');
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

  const handleEdit = (item: Service) => {
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData(defaultService);
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Services</h1>
            <p className="text-muted-foreground">Manage your services</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Service' : 'Add New Service'}</DialogTitle>
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
                    <Textarea value={formData.description_en || ''} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} rows={4} />
                  </div>
                  <div>
                    <Label>Description (বাংলা)</Label>
                    <Textarea value={formData.description_bn || ''} onChange={(e) => setFormData({ ...formData, description_bn: e.target.value })} rows={4} />
                  </div>
                  <div>
                    <Label>Description (中文)</Label>
                    <Textarea value={formData.description_zh || ''} onChange={(e) => setFormData({ ...formData, description_zh: e.target.value })} rows={4} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Icon (Lucide icon name)</Label>
                    <Input value={formData.icon || ''} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} placeholder="e.g., Star, BookOpen" />
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
                  <div>
                    <CardTitle className="text-lg">{item.title_en}</CardTitle>
                    <p className="text-sm text-muted-foreground">{item.title_bn} | {item.title_zh}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">{item.icon}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteMutation.mutate(item.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description_en}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No services found. Click "Add Service" to create one.</CardContent></Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default ServicesAdmin;
