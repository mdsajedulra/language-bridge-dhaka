import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, FileJson, RefreshCw, ShieldAlert, Upload } from 'lucide-react';
import { toast } from 'sonner';

const TABLE_LABELS: Record<string, string> = {
  site_settings: 'Site settings, footer, legal pages',
  hero_settings: 'Hero section',
  nav_items: 'Navigation menu',
  translations: 'Dynamic translations',
  courses: 'Courses',
  teachers: 'Teachers',
  books: 'Books',
  notices: 'Notices',
  jobs: 'Jobs',
  alumni: 'Alumni',
  services: 'Services',
  partners: 'Partners',
  gallery: 'Gallery',
  videos: 'Videos',
  media: 'Media/news',
  testimonials: 'Testimonials',
  admission_applications: 'Admission applications',
  contact_submissions: 'Contact messages',
  newsletter_subscribers: 'Newsletter subscribers',
};

const EXPECTED_FORMAT = 'language-bridge-full-backup';
const MAX_FILE_SIZE = 20 * 1024 * 1024;

type BackupFile = {
  format: string;
  version: number;
  generated_at?: string;
  tables?: string[];
  row_counts?: Record<string, number>;
  data: Record<string, unknown[]>;
};

const BackupRestoreAdmin = () => {
  const queryClient = useQueryClient();
  const [isExporting, setIsExporting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [backupPreview, setBackupPreview] = useState<BackupFile | null>(null);
  const [backupPayload, setBackupPayload] = useState<unknown | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const previewRows = useMemo(() => {
    if (!backupPreview?.data) return [];
    return Object.entries(backupPreview.data).map(([table, rows]) => ({
      table,
      label: TABLE_LABELS[table] || table,
      count: Array.isArray(rows) ? rows.length : 0,
    }));
  }, [backupPreview]);

  const downloadBackup = async () => {
    setIsExporting(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-export-backup', { method: 'GET' });
      if (error) throw error;
      if (!data?.success || !data?.backup) throw new Error(data?.error || 'Backup export failed');

      const backup = data.backup as BackupFile;
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const date = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
      const link = document.createElement('a');
      link.href = url;
      link.download = `language-bridge-full-backup-${date}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success('Full website backup downloaded');
    } catch (error: any) {
      toast.error(error.message || 'Failed to download backup');
    } finally {
      setIsExporting(false);
    }
  };

  const validateBackupFile = (payload: any): BackupFile => {
    const backup = payload?.backup || payload;
    if (!backup || backup.format !== EXPECTED_FORMAT || !backup.data || typeof backup.data !== 'object') {
      throw new Error('This is not a valid Language Bridge backup file');
    }

    const unknownTables = Object.keys(backup.data).filter((table) => !TABLE_LABELS[table]);
    if (unknownTables.length > 0) {
      throw new Error(`Unknown table found: ${unknownTables.join(', ')}`);
    }

    Object.entries(backup.data).forEach(([table, rows]) => {
      if (!Array.isArray(rows)) throw new Error(`${table} data is invalid`);
    });

    return backup as BackupFile;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error('Backup file is too large. Maximum size is 20MB.');
      return;
    }

    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      const backup = validateBackupFile(payload);
      setBackupPayload(backup);
      setBackupPreview(backup);
      toast.success('Backup file validated');
    } catch (error: any) {
      setBackupPayload(null);
      setBackupPreview(null);
      toast.error(error.message || 'Invalid backup file');
    }
  };

  const restoreBackup = async () => {
    if (!backupPayload) return;
    setIsRestoring(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-restore-backup', {
        body: {
          confirm: 'RESTORE_FULL_WEBSITE_DATA',
          backup: backupPayload,
        },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Restore failed');

      await Promise.all([
        queryClient.invalidateQueries(),
      ]);
      setConfirmOpen(false);
      toast.success('Website data restored successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to restore backup');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Backup & Restore</h1>
          <p className="text-muted-foreground">Download and restore every website database record without missing any text.</p>
        </div>

        <Alert>
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Important safety note</AlertTitle>
          <AlertDescription>
            Backup includes all website content, multilingual text, form submissions, subscribers, settings, and media URLs. Login passwords and authentication users are not exported for security.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Download className="h-5 w-5" /> Full Backup</CardTitle>
              <CardDescription>Export all website data as one JSON file.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={downloadBackup} disabled={isExporting} className="w-full bg-primary hover:bg-primary/90">
                {isExporting ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                Download Full Website Backup
              </Button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                {Object.entries(TABLE_LABELS).map(([table, label]) => (
                  <div key={table} className="flex items-center justify-between rounded-md border bg-background px-3 py-2">
                    <span>{label}</span>
                    <Badge variant="secondary">{table}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5" /> Restore</CardTitle>
              <CardDescription>Upload a previous backup JSON file and replace current website data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input type="file" accept="application/json,.json" onChange={handleFileChange} />

              {backupPreview && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileJson className="h-4 w-4" />
                    <span>Backup date: {backupPreview.generated_at ? new Date(backupPreview.generated_at).toLocaleString() : 'Unknown'}</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto rounded-md border">
                    {previewRows.map((row) => (
                      <div key={row.table} className="flex items-center justify-between border-b px-3 py-2 last:border-b-0">
                        <span className="text-sm">{row.label}</span>
                        <Badge>{row.count} rows</Badge>
                      </div>
                    ))}
                  </div>
                  <Button onClick={() => setConfirmOpen(true)} className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Restore This Backup
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore full website data?</DialogTitle>
            <DialogDescription>
              This will replace the current website database content with the uploaded backup data. Make a fresh backup before continuing if you need the current version.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={isRestoring}>Cancel</Button>
            <Button variant="destructive" onClick={restoreBackup} disabled={isRestoring}>
              {isRestoring ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              Confirm Restore
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default BackupRestoreAdmin;
