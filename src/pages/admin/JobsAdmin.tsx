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
import { Plus, Pencil, Trash2, MapPin, Clock, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

interface Job {
  id: string;
  title_en: string;
  title_bn: string;
  title_zh: string;
  description_en: string | null;
  description_bn: string | null;
  description_zh: string | null;
  location_en: string | null;
  location_bn: string | null;
  location_zh: string | null;
  job_type: string | null;
  salary_range: string | null;
  deadline: string | null;
  is_active: boolean | null;
}

const defaultJob: Partial<Job> = {
  title_en: '',
  title_bn: '',
  title_zh: '',
  description_en: '',
  description_bn: '',
  description_zh: '',
  location_en: '',
  location_bn: '',
  location_zh: '',
  job_type: 'full-time',
  salary_range: '',
  deadline: '',
  is_active: true,
};

const jobTypes = ['full-time', 'part-time', 'contract', 'internship'];

const JobsAdmin = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Job> | null>(null);
  const [formData, setFormData] = useState<Partial<Job>>(defaultJob);

  const { data: items, isLoading } = useQuery({
    queryKey: ['admin-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as Job[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Job>) => {
      const { error } = await supabase.from('jobs').insert([{
        title_en: data.title_en || '',
        title_bn: data.title_bn || '',
        title_zh: data.title_zh || '',
        description_en: data.description_en || null,
        description_bn: data.description_bn || null,
        description_zh: data.description_zh || null,
        location_en: data.location_en || null,
        location_bn: data.location_bn || null,
        location_zh: data.location_zh || null,
        job_type: data.job_type || 'full-time',
        salary_range: data.salary_range || null,
        deadline: data.deadline || null,
        is_active: data.is_active ?? true,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      toast.success('Job created successfully');
      setIsDialogOpen(false);
      setFormData(defaultJob);
    },
    onError: (error) => toast.error('Failed to create: ' + error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Job> }) => {
      const { error } = await supabase.from('jobs').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      toast.success('Job updated successfully');
      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData(defaultJob);
    },
    onError: (error) => toast.error('Failed to update: ' + error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('jobs').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      toast.success('Job deleted successfully');
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

  const handleEdit = (item: Job) => {
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData(defaultJob);
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Jobs</h1>
            <p className="text-muted-foreground">Manage job postings</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Add Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Job' : 'Add New Job'}</DialogTitle>
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
                    <Label>Location (English)</Label>
                    <Input value={formData.location_en || ''} onChange={(e) => setFormData({ ...formData, location_en: e.target.value })} />
                  </div>
                  <div>
                    <Label>Location (বাংলা)</Label>
                    <Input value={formData.location_bn || ''} onChange={(e) => setFormData({ ...formData, location_bn: e.target.value })} />
                  </div>
                  <div>
                    <Label>Location (中文)</Label>
                    <Input value={formData.location_zh || ''} onChange={(e) => setFormData({ ...formData, location_zh: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Job Type</Label>
                    <Select value={formData.job_type || 'full-time'} onValueChange={(value) => setFormData({ ...formData, job_type: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {jobTypes.map((type) => <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Salary Range</Label>
                    <Input value={formData.salary_range || ''} onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })} placeholder="e.g., 30,000-50,000 BDT" />
                  </div>
                  <div>
                    <Label>Deadline</Label>
                    <Input type="datetime-local" value={formData.deadline?.slice(0, 16) || ''} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} />
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
                    <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">{item.job_type}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteMutation.mutate(item.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {item.location_en && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {item.location_en}</span>}
                    {item.salary_range && <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" /> {item.salary_range}</span>}
                    {item.deadline && <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> Deadline: {format(new Date(item.deadline), 'PPP')}</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No jobs found. Click "Add Job" to create one.</CardContent></Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default JobsAdmin;
