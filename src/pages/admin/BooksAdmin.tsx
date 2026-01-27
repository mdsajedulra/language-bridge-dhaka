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
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';

interface Book {
  id: string;
  title_en: string;
  title_bn: string;
  title_zh: string;
  description_en: string | null;
  description_bn: string | null;
  description_zh: string | null;
  author: string | null;
  cover_image_url: string | null;
  price: number | null;
  sort_order: number | null;
  is_active: boolean | null;
}

const defaultBook: Partial<Book> = {
  title_en: '',
  title_bn: '',
  title_zh: '',
  description_en: '',
  description_bn: '',
  description_zh: '',
  author: '',
  cover_image_url: '',
  price: null,
  sort_order: 0,
  is_active: true,
};

const BooksAdmin = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Book> | null>(null);
  const [formData, setFormData] = useState<Partial<Book>>(defaultBook);

  const { data: items, isLoading } = useQuery({
    queryKey: ['admin-books'],
    queryFn: async () => {
      const { data, error } = await supabase.from('books').select('*').order('sort_order');
      if (error) throw error;
      return data as Book[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Book>) => {
      const { error } = await supabase.from('books').insert([{
        title_en: data.title_en || '',
        title_bn: data.title_bn || '',
        title_zh: data.title_zh || '',
        description_en: data.description_en || null,
        description_bn: data.description_bn || null,
        description_zh: data.description_zh || null,
        author: data.author || null,
        cover_image_url: data.cover_image_url || null,
        price: data.price || null,
        sort_order: data.sort_order || 0,
        is_active: data.is_active ?? true,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-books'] });
      toast.success('Book created successfully');
      setIsDialogOpen(false);
      setFormData(defaultBook);
    },
    onError: (error) => toast.error('Failed to create: ' + error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Book> }) => {
      const { error } = await supabase.from('books').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-books'] });
      toast.success('Book updated successfully');
      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData(defaultBook);
    },
    onError: (error) => toast.error('Failed to update: ' + error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('books').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-books'] });
      toast.success('Book deleted successfully');
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

  const handleEdit = (item: Book) => {
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData(defaultBook);
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Books</h1>
            <p className="text-muted-foreground">Manage textbooks and publications</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Add Book
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Book' : 'Add New Book'}</DialogTitle>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Author</Label>
                    <Input value={formData.author || ''} onChange={(e) => setFormData({ ...formData, author: e.target.value })} />
                  </div>
                  <div>
                    <Label>Price (৳)</Label>
                    <Input type="number" value={formData.price || ''} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || null })} />
                  </div>
                  <div>
                    <Label>Cover Image URL</Label>
                    <Input value={formData.cover_image_url || ''} onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })} placeholder="https://..." />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[1, 2, 3, 4].map((i) => <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-lg" />)}</div>
        ) : items && items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-[3/4] relative bg-muted">
                  {item.cover_image_url ? (
                    <img src={item.cover_image_url} alt={item.title_en} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><BookOpen className="h-12 w-12 text-muted-foreground" /></div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button variant="secondary" size="icon" onClick={() => handleEdit(item)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="destructive" size="icon" onClick={() => deleteMutation.mutate(item.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  {!item.is_active && <div className="absolute top-2 left-2"><span className="px-2 py-0.5 rounded text-xs bg-gray-500/80 text-white">Hidden</span></div>}
                </div>
                <CardContent className="p-3">
                  <p className="text-sm font-medium truncate">{item.title_en}</p>
                  {item.author && <p className="text-xs text-muted-foreground truncate">{item.author}</p>}
                  {item.price && <p className="text-sm font-semibold text-primary">৳{item.price}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card><CardContent className="py-12 text-center text-muted-foreground flex flex-col items-center gap-2"><BookOpen className="h-12 w-12" />No books found. Click "Add Book" to add one.</CardContent></Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default BooksAdmin;
