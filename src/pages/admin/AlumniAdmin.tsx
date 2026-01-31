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
import { Plus, Pencil, Trash2, Star } from 'lucide-react';

interface Alumni {
  id: string;
  name: string;
  batch_year: number | null;
  company: string | null;
  current_position_en: string | null;
  current_position_bn: string | null;
  current_position_zh: string | null;
  story_en: string | null;
  story_bn: string | null;
  story_zh: string | null;
  photo_url: string | null;
  is_featured: boolean | null;
  is_active: boolean | null;
}

const defaultAlumni: Partial<Alumni> = {
  name: '',
  batch_year: new Date().getFullYear(),
  company: '',
  current_position_en: '',
  current_position_bn: '',
  current_position_zh: '',
  story_en: '',
  story_bn: '',
  story_zh: '',
  photo_url: '',
  is_featured: false,
  is_active: true,
};

const AlumniAdmin = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Alumni> | null>(null);
  const [formData, setFormData] = useState<Partial<Alumni>>(defaultAlumni);

  const { data: items, isLoading } = useQuery({
    queryKey: ['admin-alumni'],
    queryFn: async () => {
      const { data, error } = await supabase.from('alumni').select('*').order('batch_year', { ascending: false });
      if (error) throw error;
      return data as Alumni[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Alumni>) => {
      const { error } = await supabase.from('alumni').insert([{
        name: data.name || '',
        batch_year: data.batch_year || null,
        company: data.company || null,
        current_position_en: data.current_position_en || null,
        current_position_bn: data.current_position_bn || null,
        current_position_zh: data.current_position_zh || null,
        story_en: data.story_en || null,
        story_bn: data.story_bn || null,
        story_zh: data.story_zh || null,
        photo_url: data.photo_url || null,
        is_featured: data.is_featured ?? false,
        is_active: data.is_active ?? true,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-alumni'] });
      toast.success('Alumni created successfully');
      setIsDialogOpen(false);
      setFormData(defaultAlumni);
    },
    onError: (error) => toast.error('Failed to create: ' + error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Alumni> }) => {
      const { error } = await supabase.from('alumni').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-alumni'] });
      toast.success('Alumni updated successfully');
      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData(defaultAlumni);
    },
    onError: (error) => toast.error('Failed to update: ' + error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('alumni').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-alumni'] });
      toast.success('Alumni deleted successfully');
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

  const handleEdit = (item: Alumni) => {
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData(defaultAlumni);
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Alumni</h1>
            <p className="text-muted-foreground">Manage alumni success stories</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Add Alumni
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Alumni' : 'Add New Alumni'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Batch Year</Label>
                    <Input type="number" value={formData.batch_year || ''} onChange={(e) => setFormData({ ...formData, batch_year: parseInt(e.target.value) || null })} />
                  </div>
                  <div>
                    <Label>Company</Label>
                    <Input value={formData.company || ''} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Position (English)</Label>
                    <Input value={formData.current_position_en || ''} onChange={(e) => setFormData({ ...formData, current_position_en: e.target.value })} />
                  </div>
                  <div>
                    <Label>Position (বাংলা)</Label>
                    <Input value={formData.current_position_bn || ''} onChange={(e) => setFormData({ ...formData, current_position_bn: e.target.value })} />
                  </div>
                  <div>
                    <Label>Position (中文)</Label>
                    <Input value={formData.current_position_zh || ''} onChange={(e) => setFormData({ ...formData, current_position_zh: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Story (English)</Label>
                    <Textarea value={formData.story_en || ''} onChange={(e) => setFormData({ ...formData, story_en: e.target.value })} rows={4} />
                  </div>
                  <div>
                    <Label>Story (বাংলা)</Label>
                    <Textarea value={formData.story_bn || ''} onChange={(e) => setFormData({ ...formData, story_bn: e.target.value })} rows={4} />
                  </div>
                  <div>
                    <Label>Story (中文)</Label>
                    <Textarea value={formData.story_zh || ''} onChange={(e) => setFormData({ ...formData, story_zh: e.target.value })} rows={4} />
                  </div>
                </div>

                <CloudinaryUpload
                  value={formData.photo_url || null}
                  onChange={(url) => setFormData({ ...formData, photo_url: url || '' })}
                  folder="language-bridge/alumni"
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
                      <p className="text-sm text-muted-foreground">{item.current_position_en} {item.company && `at ${item.company}`}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.batch_year && <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">Batch {item.batch_year}</span>}
                    <span className={`px-2 py-1 rounded-full text-xs ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteMutation.mutate(item.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.story_en}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No alumni found. Click "Add Alumni" to create one.</CardContent></Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AlumniAdmin;
