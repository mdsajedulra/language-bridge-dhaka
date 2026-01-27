import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';

interface NavItem {
  id: string;
  path: string;
  label_en: string;
  label_bn: string;
  label_zh: string;
  sort_order: number;
  is_active: boolean | null;
}

const defaultNavItem: Partial<NavItem> = {
  path: '',
  label_en: '',
  label_bn: '',
  label_zh: '',
  sort_order: 0,
  is_active: true,
};

const NavigationAdmin = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<NavItem> | null>(null);
  const [formData, setFormData] = useState<Partial<NavItem>>(defaultNavItem);

  const { data: navItems, isLoading } = useQuery({
    queryKey: ['admin-nav-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nav_items')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data as NavItem[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<NavItem>) => {
      const insertData = {
        path: data.path || '',
        label_en: data.label_en || '',
        label_bn: data.label_bn || '',
        label_zh: data.label_zh || '',
        sort_order: data.sort_order || 0,
        is_active: data.is_active ?? true,
      };
      const { error } = await supabase.from('nav_items').insert([insertData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-nav-items'] });
      queryClient.invalidateQueries({ queryKey: ['nav-items'] });
      toast.success('Navigation item created');
      setIsDialogOpen(false);
      setFormData(defaultNavItem);
    },
    onError: (error) => {
      toast.error('Failed to create: ' + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<NavItem> }) => {
      const { error } = await supabase.from('nav_items').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-nav-items'] });
      queryClient.invalidateQueries({ queryKey: ['nav-items'] });
      toast.success('Navigation item updated');
      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData(defaultNavItem);
    },
    onError: (error) => {
      toast.error('Failed to update: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('nav_items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-nav-items'] });
      queryClient.invalidateQueries({ queryKey: ['nav-items'] });
      toast.success('Navigation item deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete: ' + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem?.id) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (item: NavItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ ...defaultNavItem, sort_order: (navItems?.length || 0) + 1 });
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Navigation</h1>
            <p className="text-muted-foreground">Manage menu items and their labels</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd} className="bg-[#0A6B4E] hover:bg-[#0A6B4E]/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Navigation Item' : 'Add Navigation Item'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Path (e.g., /about)</Label>
                  <Input
                    value={formData.path || ''}
                    onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                    placeholder="/about"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label>Label (English)</Label>
                    <Input
                      value={formData.label_en || ''}
                      onChange={(e) => setFormData({ ...formData, label_en: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Label (বাংলা)</Label>
                    <Input
                      value={formData.label_bn || ''}
                      onChange={(e) => setFormData({ ...formData, label_bn: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Label (中文)</Label>
                    <Input
                      value={formData.label_zh || ''}
                      onChange={(e) => setFormData({ ...formData, label_zh: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label>Sort Order</Label>
                    <Input
                      type="number"
                      value={formData.sort_order || 0}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch
                      checked={formData.is_active || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label>Active</Label>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#0A6B4E] hover:bg-[#0A6B4E]/90">
                    {editingItem ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="h-16" />
              </Card>
            ))}
          </div>
        ) : navItems && navItems.length > 0 ? (
          <div className="space-y-2">
            {navItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.label_en}</span>
                        <span className="text-sm text-muted-foreground">({item.path})</span>
                        {!item.is_active && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.label_bn} | {item.label_zh}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600"
                      onClick={() => deleteMutation.mutate(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No navigation items found.
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default NavigationAdmin;
