import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Course {
  id: string;
  title_en: string;
  title_bn: string;
  title_zh: string;
  description_en: string | null;
  description_bn: string | null;
  description_zh: string | null;
  duration_en: string | null;
  duration_bn: string | null;
  duration_zh: string | null;
  features_en: string[] | null;
  features_bn: string[] | null;
  features_zh: string[] | null;
  icon: string | null;
  image_url: string | null;
  price: number | null;
  is_featured: boolean | null;
  is_active: boolean | null;
  sort_order: number | null;
}

const defaultCourse: Partial<Course> = {
  title_en: '',
  title_bn: '',
  title_zh: '',
  description_en: '',
  description_bn: '',
  description_zh: '',
  duration_en: '',
  duration_bn: '',
  duration_zh: '',
  features_en: [],
  features_bn: [],
  features_zh: [],
  icon: 'BookOpen',
  image_url: '',
  price: null,
  is_featured: false,
  is_active: true,
  sort_order: 0,
};

const CoursesAdmin = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [formData, setFormData] = useState<Partial<Course>>(defaultCourse);

  const { data: courses, isLoading } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data as Course[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Course>) => {
      const insertData = {
        title_en: data.title_en || '',
        title_bn: data.title_bn || '',
        title_zh: data.title_zh || '',
        description_en: data.description_en || null,
        description_bn: data.description_bn || null,
        description_zh: data.description_zh || null,
        duration_en: data.duration_en || null,
        duration_bn: data.duration_bn || null,
        duration_zh: data.duration_zh || null,
        features_en: data.features_en || [],
        features_bn: data.features_bn || [],
        features_zh: data.features_zh || [],
        icon: data.icon || 'BookOpen',
        image_url: data.image_url || null,
        price: data.price || null,
        is_featured: data.is_featured || false,
        is_active: data.is_active ?? true,
        sort_order: data.sort_order || 0,
      };
      const { error } = await supabase.from('courses').insert([insertData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast.success('Course created successfully');
      setIsDialogOpen(false);
      setFormData(defaultCourse);
    },
    onError: (error) => {
      toast.error('Failed to create course: ' + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Course> }) => {
      const { error } = await supabase.from('courses').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast.success('Course updated successfully');
      setIsDialogOpen(false);
      setEditingCourse(null);
      setFormData(defaultCourse);
    },
    onError: (error) => {
      toast.error('Failed to update course: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast.success('Course deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete course: ' + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse?.id) {
      updateMutation.mutate({ id: editingCourse.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData(course);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingCourse(null);
    setFormData(defaultCourse);
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Courses</h1>
            <p className="text-muted-foreground">Manage your course offerings</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd} className="bg-[#0A6B4E] hover:bg-[#0A6B4E]/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Title (English)</Label>
                    <Input
                      value={formData.title_en || ''}
                      onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Title (বাংলা)</Label>
                    <Input
                      value={formData.title_bn || ''}
                      onChange={(e) => setFormData({ ...formData, title_bn: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Title (中文)</Label>
                    <Input
                      value={formData.title_zh || ''}
                      onChange={(e) => setFormData({ ...formData, title_zh: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Description (English)</Label>
                    <RichTextEditor
                      value={formData.description_en || ''}
                      onChange={(value) => setFormData({ ...formData, description_en: value })}
                    />
                  </div>
                  <div>
                    <Label>Description (বাংলা)</Label>
                    <RichTextEditor
                      value={formData.description_bn || ''}
                      onChange={(value) => setFormData({ ...formData, description_bn: value })}
                    />
                  </div>
                  <div>
                    <Label>Description (中文)</Label>
                    <RichTextEditor
                      value={formData.description_zh || ''}
                      onChange={(value) => setFormData({ ...formData, description_zh: value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Duration (English)</Label>
                    <Input
                      value={formData.duration_en || ''}
                      onChange={(e) => setFormData({ ...formData, duration_en: e.target.value })}
                      placeholder="e.g., 6 Months"
                    />
                  </div>
                  <div>
                    <Label>Duration (বাংলা)</Label>
                    <Input
                      value={formData.duration_bn || ''}
                      onChange={(e) => setFormData({ ...formData, duration_bn: e.target.value })}
                      placeholder="e.g., ৬ মাস"
                    />
                  </div>
                  <div>
                    <Label>Duration (中文)</Label>
                    <Input
                      value={formData.duration_zh || ''}
                      onChange={(e) => setFormData({ ...formData, duration_zh: e.target.value })}
                      placeholder="e.g., 6个月"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Price (৳)</Label>
                    <Input
                      type="number"
                      value={formData.price || ''}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || null })}
                    />
                  </div>
                  <div>
                    <Label>Sort Order</Label>
                    <Input
                      type="number"
                      value={formData.sort_order || 0}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label>Image URL</Label>
                    <Input
                      value={formData.image_url || ''}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* Features Section */}
                <div className="border-t pt-4 mt-4">
                  <Label className="text-lg font-semibold">Course Features (one per line)</Label>
                  <p className="text-sm text-muted-foreground mb-4">Add features/benefits for this course. Each line will be a bullet point.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Features (English)</Label>
                      <Textarea
                        value={(formData.features_en || []).join('\n')}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          features_en: e.target.value.split('\n').filter(f => f.trim()) 
                        })}
                        rows={5}
                        placeholder="Expert native Chinese teachers&#10;Comprehensive study materials&#10;Certificate upon completion"
                      />
                    </div>
                    <div>
                      <Label>Features (বাংলা)</Label>
                      <Textarea
                        value={(formData.features_bn || []).join('\n')}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          features_bn: e.target.value.split('\n').filter(f => f.trim()) 
                        })}
                        rows={5}
                        placeholder="বিশেষজ্ঞ চাইনিজ শিক্ষক&#10;সম্পূর্ণ স্টাডি ম্যাটেরিয়াল&#10;সার্টিফিকেট প্রদান"
                      />
                    </div>
                    <div>
                      <Label>Features (中文)</Label>
                      <Textarea
                        value={(formData.features_zh || []).join('\n')}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          features_zh: e.target.value.split('\n').filter(f => f.trim()) 
                        })}
                        rows={5}
                        placeholder="专业中文教师&#10;全面的学习材料&#10;结业证书"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_active || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label>Active</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_featured || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                    />
                    <Label>Featured</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#0A6B4E] hover:bg-[#0A6B4E]/90">
                    {editingCourse ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="h-24" />
              </Card>
            ))}
          </div>
        ) : courses && courses.length > 0 ? (
          <div className="grid gap-4">
            {courses.map((course) => (
              <Card key={course.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg">{course.title_en}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {course.title_bn} | {course.title_zh}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${course.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {course.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(course)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600"
                      onClick={() => deleteMutation.mutate(course.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.description_en}
                  </p>
                  {course.duration_en && (
                    <p className="text-sm mt-2">
                      <span className="font-medium">Duration:</span> {course.duration_en}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No courses found. Click "Add Course" to create your first course.
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default CoursesAdmin;
