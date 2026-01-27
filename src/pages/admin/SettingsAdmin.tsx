import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

interface Setting {
  id: string;
  key: string;
  value_en: string | null;
  value_bn: string | null;
  value_zh: string | null;
  image_url: string | null;
}

const SettingsAdmin = () => {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<Record<string, Setting>>({});

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['admin-site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      if (error) throw error;
      return data as Setting[];
    },
  });

  useEffect(() => {
    if (settingsData) {
      const settingsMap = settingsData.reduce((acc, item) => {
        acc[item.key] = item;
        return acc;
      }, {} as Record<string, Setting>);
      setSettings(settingsMap);
    }
  }, [settingsData]);

  const updateMutation = useMutation({
    mutationFn: async (updates: { key: string; data: Partial<Setting> }[]) => {
      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .update(update.data)
          .eq('key', update.key);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-site-settings'] });
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast.success('Settings saved successfully');
    },
    onError: (error) => {
      toast.error('Failed to save settings: ' + error.message);
    },
  });

  const handleSave = () => {
    const updates = Object.entries(settings).map(([key, setting]) => ({
      key,
      data: {
        value_en: setting.value_en,
        value_bn: setting.value_bn,
        value_zh: setting.value_zh,
        image_url: setting.image_url,
      },
    }));
    updateMutation.mutate(updates);
  };

  const updateSetting = (key: string, field: keyof Setting, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
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
            <h1 className="text-3xl font-bold text-foreground">Site Settings</h1>
            <p className="text-muted-foreground">Manage your website's basic information</p>
          </div>
          <Button onClick={handleSave} className="bg-[#0A6B4E] hover:bg-[#0A6B4E]/90">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Site Name */}
          <Card>
            <CardHeader>
              <CardTitle>Site Name</CardTitle>
              <CardDescription>The name of your institute displayed in the header</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>English</Label>
                <Input
                  value={settings.site_name?.value_en || ''}
                  onChange={(e) => updateSetting('site_name', 'value_en', e.target.value)}
                />
              </div>
              <div>
                <Label>বাংলা</Label>
                <Input
                  value={settings.site_name?.value_bn || ''}
                  onChange={(e) => updateSetting('site_name', 'value_bn', e.target.value)}
                />
              </div>
              <div>
                <Label>中文</Label>
                <Input
                  value={settings.site_name?.value_zh || ''}
                  onChange={(e) => updateSetting('site_name', 'value_zh', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Site Tagline */}
          <Card>
            <CardHeader>
              <CardTitle>Site Tagline</CardTitle>
              <CardDescription>A short tagline shown below the site name</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>English</Label>
                <Input
                  value={settings.site_tagline?.value_en || ''}
                  onChange={(e) => updateSetting('site_tagline', 'value_en', e.target.value)}
                />
              </div>
              <div>
                <Label>বাংলা</Label>
                <Input
                  value={settings.site_tagline?.value_bn || ''}
                  onChange={(e) => updateSetting('site_tagline', 'value_bn', e.target.value)}
                />
              </div>
              <div>
                <Label>中文</Label>
                <Input
                  value={settings.site_tagline?.value_zh || ''}
                  onChange={(e) => updateSetting('site_tagline', 'value_zh', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Footer Description */}
          <Card>
            <CardHeader>
              <CardTitle>Footer Description</CardTitle>
              <CardDescription>About text shown in the website footer</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>English</Label>
                <Textarea
                  value={settings.footer_description?.value_en || ''}
                  onChange={(e) => updateSetting('footer_description', 'value_en', e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label>বাংলা</Label>
                <Textarea
                  value={settings.footer_description?.value_bn || ''}
                  onChange={(e) => updateSetting('footer_description', 'value_bn', e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label>中文</Label>
                <Textarea
                  value={settings.footer_description?.value_zh || ''}
                  onChange={(e) => updateSetting('footer_description', 'value_zh', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Address, phone, and email displayed on the website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Address (English)</Label>
                  <Textarea
                    value={settings.contact_address?.value_en || ''}
                    onChange={(e) => updateSetting('contact_address', 'value_en', e.target.value)}
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Address (বাংলা)</Label>
                  <Textarea
                    value={settings.contact_address?.value_bn || ''}
                    onChange={(e) => updateSetting('contact_address', 'value_bn', e.target.value)}
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Address (中文)</Label>
                  <Textarea
                    value={settings.contact_address?.value_zh || ''}
                    onChange={(e) => updateSetting('contact_address', 'value_zh', e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={settings.contact_phone?.value_en || ''}
                    onChange={(e) => updateSetting('contact_phone', 'value_en', e.target.value)}
                    placeholder="+880 1234-567890"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={settings.contact_email?.value_en || ''}
                    onChange={(e) => updateSetting('contact_email', 'value_en', e.target.value)}
                    placeholder="info@example.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logo */}
          <Card>
            <CardHeader>
              <CardTitle>Logo</CardTitle>
              <CardDescription>Upload your institute logo (provide image URL)</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label>Logo Image URL</Label>
                <Input
                  value={settings.logo?.image_url || ''}
                  onChange={(e) => updateSetting('logo', 'image_url', e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
                {settings.logo?.image_url && (
                  <div className="mt-4">
                    <img
                      src={settings.logo.image_url}
                      alt="Logo preview"
                      className="h-16 w-16 object-contain rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsAdmin;
