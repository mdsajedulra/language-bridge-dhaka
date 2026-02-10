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
import { CloudinaryUpload } from '@/components/ui/cloudinary-upload';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Star, Phone, Mail } from 'lucide-react';

interface Teacher {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  photo_url: string | null;
  designation_en: string | null;
  designation_bn: string | null;
  designation_zh: string | null;
  bio_en: string | null;
  bio_bn: string | null;
  bio_zh: string | null;
  specialization_en: string | null;
  specialization_bn: string | null;
  specialization_zh: string | null;
  is_featured: boolean | null;
  is_active: boolean | null;
  sort_order: number | null;
}

const defaultTeacher: Partial<Teacher> = {
  name: '',
  phone: '',
  email: '',
  photo_url: '',
  designation_en: '',
  designation_bn: '',
  designation_zh: '',
  bio_en: '',
  bio_bn: '',
  bio_zh: '',
  specialization_en: '',
  specialization_bn: '',
  specialization_zh: '',
  is_featured: false,
  is_active: true,
  sort_order: 0,
};

const TeachersAdmin = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Teacher> | null>(null);
  const [formData, setFormData] = useState<Partial<Teacher>>(defaultTeacher);

  const { data: items, isLoading } = useQuery({
    queryKey: ['admin-teachers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('teachers' as any).select('*').order('sort_order', { ascending: true });
      if (error) throw error;
      return data as unknown as Teacher[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Teacher>) => {
      const { error } = await supabase.from('teachers' as any).insert([{
        name: data.name || '',
        phone: data.phone || null,
        email: data.email || null,
        photo_url: data.photo_url || null,
        designation_en: data.designation_en || null,
        designation_bn: data.designation_bn || null,
        designation_zh: data.designation_zh || null,
        bio_en: data.bio_en || null,
        bio_bn: data.bio_bn || null,
        bio_zh: data.bio_zh || null,
        specialization_en: data.specialization_en || null,
        specialization_bn: data.specialization_bn || null,
        specialization_zh: data.specialization_zh || null,
        is_featured: data.is_featured ?? false,
        is_active: data.is_active ?? true,
        sort_order: data.sort_order ?? 0,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-teachers'] });
      toast.success('Teacher created successfully');
      setIsDialogOpen(false);
      setFormData(defaultTeacher);
    },
    onError: (error) => toast.error('Failed to create: ' + error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Teacher> }) => {
      const { error } = await supabase.from('teachers' as any).update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-teachers'] });
      toast.success('Teacher updated successfully');
      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData(defaultTeacher);
    },
    onError: (error) => toast.error('Failed to update: ' + error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('teachers' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-teachers'] });
      toast.success('Teacher deleted successfully');
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

  const handleEdit = (item: Teacher) => {
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData(defaultTeacher);
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Teachers</h1>
            <p className="text-muted-foreground">Manage your teaching staff</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Name *</Label>
                    <Input value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Sort Order</Label>
                    <Input type="number" value={formData.sort_order ?? 0} onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Phone</Label>
                    <Input value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Designation (English)</Label>
                    <Input value={formData.designation_en || ''} onChange={(e) => setFormData({ ...formData, designation_en: e.target.value })} />
                  </div>
                  <div>
                    <Label>Designation (বাংলা)</Label>
                    <Input value={formData.designation_bn || ''} onChange={(e) => setFormData({ ...formData, designation_bn: e.target.value })} />
                  </div>
                  <div>
                    <Label>Designation (中文)</Label>
                    <Input value={formData.designation_zh || ''} onChange={(e) => setFormData({ ...formData, designation_zh: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Specialization (English)</Label>
                    <Input value={formData.specialization_en || ''} onChange={(e) => setFormData({ ...formData, specialization_en: e.target.value })} />
                  </div>
                  <div>
                    <Label>Specialization (বাংলা)</Label>
                    <Input value={formData.specialization_bn || ''} onChange={(e) => setFormData({ ...formData, specialization_bn: e.target.value })} />
                  </div>
                  <div>
                    <Label>Specialization (中文)</Label>
                    <Input value={formData.specialization_zh || ''} onChange={(e) => setFormData({ ...formData, specialization_zh: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Bio (English)</Label>
                    <Textarea value={formData.bio_en || ''} onChange={(e) => setFormData({ ...formData, bio_en: e.target.value })} rows={4} />
                  </div>
                  <div>
                    <Label>Bio (বাংলা)</Label>
                    <Textarea value={formData.bio_bn || ''} onChange={(e) => setFormData({ ...formData, bio_bn: e.target.value })} rows={4} />
                  </div>
                  <div>
                    <Label>Bio (中文)</Label>
                    <Textarea value={formData.bio_zh || ''} onChange={(e) => setFormData({ ...formData, bio_zh: e.target.value })} rows={4} />
                  </div>
                </div>

                <CloudinaryUpload
                  value={formData.photo_url || null}
                  onChange={(url) => setFormData({ ...formData, photo_url: url || '' })}
                  folder="language-bridge/teachers"
                  label="Photo"
                />

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Switch checked={formData.is_featured || false} onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })} />
                    <Label>Featured</Label>
                  </div>
                  <div className="flex items-center gap-2">
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
                    {item.photo_url && <img src={item.photo_url} alt={item.name} className="w-12 h-12 rounded-full object-cover" />}
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {item.name}
                        {item.is_featured && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{item.designation_en}</p>
                      {item.specialization_en && <p className="text-xs text-muted-foreground">{item.specialization_en}</p>}
                      {item.phone && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {item.phone}
                        </p>
                      )}
                      {item.email && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {item.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">Order: {item.sort_order}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteMutation.mutate(item.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.bio_en}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No teachers found. Click "Add Teacher" to create one.</CardContent></Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default TeachersAdmin;
