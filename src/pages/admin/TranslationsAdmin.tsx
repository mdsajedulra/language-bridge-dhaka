import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Search, Languages } from 'lucide-react';

interface Translation {
  id: string;
  key: string;
  value_en: string;
  value_bn: string;
  value_zh: string;
  category: string | null;
}

const defaultTranslation: Partial<Translation> = {
  key: '',
  value_en: '',
  value_bn: '',
  value_zh: '',
  category: 'general',
};

const categories = ['general', 'navigation', 'hero', 'courses', 'contact', 'footer', 'common', 'forms'];

const TranslationsAdmin = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Translation> | null>(null);
  const [formData, setFormData] = useState<Partial<Translation>>(defaultTranslation);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const { data: items, isLoading } = useQuery({
    queryKey: ['admin-translations'],
    queryFn: async () => {
      const { data, error } = await supabase.from('translations').select('*').order('category').order('key');
      if (error) throw error;
      return data as Translation[];
    },
  });

  const filteredItems = items?.filter((item) => {
    const matchesSearch = searchQuery === '' || 
      item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.value_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.value_bn.includes(searchQuery) ||
      item.value_zh.includes(searchQuery);
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Translation>) => {
      const { error } = await supabase.from('translations').insert([{
        key: data.key || '',
        value_en: data.value_en || '',
        value_bn: data.value_bn || '',
        value_zh: data.value_zh || '',
        category: data.category || 'general',
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-translations'] });
      toast.success('Translation created successfully');
      setIsDialogOpen(false);
      setFormData(defaultTranslation);
    },
    onError: (error) => toast.error('Failed to create: ' + error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Translation> }) => {
      const { error } = await supabase.from('translations').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-translations'] });
      toast.success('Translation updated successfully');
      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData(defaultTranslation);
    },
    onError: (error) => toast.error('Failed to update: ' + error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('translations').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-translations'] });
      toast.success('Translation deleted successfully');
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

  const handleEdit = (item: Translation) => {
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData(defaultTranslation);
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Translations</h1>
            <p className="text-muted-foreground">Manage multilingual text content</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Add Translation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Translation' : 'Add New Translation'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Key</Label>
                    <Input value={formData.key || ''} onChange={(e) => setFormData({ ...formData, key: e.target.value })} placeholder="e.g., hero.title" required />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select value={formData.category || 'general'} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>English</Label>
                  <Input value={formData.value_en || ''} onChange={(e) => setFormData({ ...formData, value_en: e.target.value })} required />
                </div>
                <div>
                  <Label>বাংলা (Bangla)</Label>
                  <Input value={formData.value_bn || ''} onChange={(e) => setFormData({ ...formData, value_bn: e.target.value })} required />
                </div>
                <div>
                  <Label>中文 (Chinese)</Label>
                  <Input value={formData.value_zh || ''} onChange={(e) => setFormData({ ...formData, value_zh: e.target.value })} required />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">{editingItem ? 'Update' : 'Create'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search translations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48"><SelectValue placeholder="Filter by category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <Card className="animate-pulse"><CardContent className="h-64" /></Card>
        ) : filteredItems && filteredItems.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-48">Key</TableHead>
                    <TableHead>English</TableHead>
                    <TableHead>বাংলা</TableHead>
                    <TableHead>中文</TableHead>
                    <TableHead className="w-24">Category</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-sm">{item.key}</TableCell>
                      <TableCell className="max-w-40 truncate">{item.value_en}</TableCell>
                      <TableCell className="max-w-40 truncate">{item.value_bn}</TableCell>
                      <TableCell className="max-w-40 truncate">{item.value_zh}</TableCell>
                      <TableCell><span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">{item.category}</span></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteMutation.mutate(item.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card><CardContent className="py-12 text-center text-muted-foreground flex flex-col items-center gap-2"><Languages className="h-12 w-12" />No translations found. Click "Add Translation" to create one.</CardContent></Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default TranslationsAdmin;
