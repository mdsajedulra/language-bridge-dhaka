import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CloudinaryUpload } from '@/components/ui/cloudinary-upload';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

interface HeroSetting {
  id: string;
  tagline_en: string;
  tagline_bn: string;
  tagline_zh: string;
  subtitle_en: string;
  subtitle_bn: string;
  subtitle_zh: string;
  badge_text: string | null;
  background_image_url: string | null;
  stat_students: string | null;
  stat_teachers: string | null;
  stat_years: string | null;
}

const HeroAdmin = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<HeroSetting>>({});

  const { data: heroSetting, isLoading } = useQuery({
    queryKey: ['admin-hero-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_settings')
        .select('*')
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as HeroSetting | null;
    },
  });

  useEffect(() => {
    if (heroSetting) {
      setFormData(heroSetting);
    }
  }, [heroSetting]);

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<HeroSetting>) => {
      if (heroSetting?.id) {
        const { error } = await supabase
          .from('hero_settings')
          .update(data)
          .eq('id', heroSetting.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hero-settings'] });
      queryClient.invalidateQueries({ queryKey: ['hero-settings'] });
      toast.success('Hero section updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update: ' + error.message);
    },
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="h-32" />
            </Card>
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Hero Section</h1>
            <p className="text-muted-foreground">Customize the main banner on your homepage</p>
          </div>
          <Button onClick={handleSave} className="bg-[#0A6B4E] hover:bg-[#0A6B4E]/90">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Tagline */}
          <Card>
            <CardHeader>
              <CardTitle>Main Tagline</CardTitle>
              <CardDescription>The primary headline displayed in the hero section</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>English</Label>
                <Input
                  value={formData.tagline_en || ''}
                  onChange={(e) => setFormData({ ...formData, tagline_en: e.target.value })}
                />
              </div>
              <div>
                <Label>বাংলা</Label>
                <Input
                  value={formData.tagline_bn || ''}
                  onChange={(e) => setFormData({ ...formData, tagline_bn: e.target.value })}
                />
              </div>
              <div>
                <Label>中文</Label>
                <Input
                  value={formData.tagline_zh || ''}
                  onChange={(e) => setFormData({ ...formData, tagline_zh: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Subtitle */}
          <Card>
            <CardHeader>
              <CardTitle>Subtitle</CardTitle>
              <CardDescription>Supporting text below the main tagline</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>English</Label>
                <Textarea
                  value={formData.subtitle_en || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle_en: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label>বাংলা</Label>
                <Textarea
                  value={formData.subtitle_bn || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle_bn: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label>中文</Label>
                <Textarea
                  value={formData.subtitle_zh || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle_zh: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Badge & Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Badge & Statistics</CardTitle>
              <CardDescription>The badge text and stat counters shown in the hero</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Badge Text</Label>
                <Input
                  value={formData.badge_text || ''}
                  onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                  placeholder="🇧🇩 Bangladesh - China 🇨🇳 Friendship"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Students Count</Label>
                  <Input
                    value={formData.stat_students || ''}
                    onChange={(e) => setFormData({ ...formData, stat_students: e.target.value })}
                    placeholder="5000+"
                  />
                </div>
                <div>
                  <Label>Teachers Count</Label>
                  <Input
                    value={formData.stat_teachers || ''}
                    onChange={(e) => setFormData({ ...formData, stat_teachers: e.target.value })}
                    placeholder="25+"
                  />
                </div>
                <div>
                  <Label>Years</Label>
                  <Input
                    value={formData.stat_years || ''}
                    onChange={(e) => setFormData({ ...formData, stat_years: e.target.value })}
                    placeholder="9+"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Background Image */}
          <Card>
            <CardHeader>
              <CardTitle>Background Image</CardTitle>
              <CardDescription>Optional background image for the hero section</CardDescription>
            </CardHeader>
            <CardContent>
              <CloudinaryUpload
                value={formData.background_image_url || null}
                onChange={(url) => setFormData({ ...formData, background_image_url: url || '' })}
                folder="language-bridge/hero"
                label="Background Image"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default HeroAdmin;
