import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string | null;
  address: string | null;
  education_level: string | null;
  course_id: string | null;
  preferred_schedule: string | null;
  how_did_you_hear: string | null;
  additional_notes: string | null;
  status: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewing: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const ApplicationsAdmin = () => {
  const queryClient = useQueryClient();

  const { data: applications, isLoading } = useQuery({
    queryKey: ['admin-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admission_applications')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Application[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('admission_applications')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success('Application status updated');
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('admission_applications')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success('Application deleted');
    },
    onError: () => {
      toast.error('Failed to delete application');
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admission Applications</h1>
          <p className="text-muted-foreground">Review and manage student applications</p>
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="h-40" />
              </Card>
            ))}
          </div>
        ) : applications && applications.length > 0 ? (
          <div className="grid gap-4">
            {applications.map((app) => (
              <Card key={app.id} className={app.status === 'pending' ? 'border-l-4 border-l-yellow-500' : ''}>
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{app.full_name}</CardTitle>
                      <Badge className={statusColors[app.status || 'pending']}>
                        {app.status || 'pending'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{app.email} | {app.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(app.created_at), 'MMM d, yyyy')}
                    </span>
                    <Select
                      value={app.status || 'pending'}
                      onValueChange={(value) => updateStatusMutation.mutate({ id: app.id, status: value })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewing">Reviewing</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600"
                      onClick={() => deleteMutation.mutate(app.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {app.education_level && (
                      <div>
                        <span className="font-medium">Education:</span>{' '}
                        <span className="text-muted-foreground">{app.education_level}</span>
                      </div>
                    )}
                    {app.preferred_schedule && (
                      <div>
                        <span className="font-medium">Schedule:</span>{' '}
                        <span className="text-muted-foreground">{app.preferred_schedule}</span>
                      </div>
                    )}
                    {app.how_did_you_hear && (
                      <div>
                        <span className="font-medium">Source:</span>{' '}
                        <span className="text-muted-foreground">{app.how_did_you_hear}</span>
                      </div>
                    )}
                    {app.address && (
                      <div>
                        <span className="font-medium">Address:</span>{' '}
                        <span className="text-muted-foreground">{app.address}</span>
                      </div>
                    )}
                  </div>
                  {app.additional_notes && (
                    <p className="mt-4 text-sm text-muted-foreground">
                      <span className="font-medium">Notes:</span> {app.additional_notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No applications yet.
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default ApplicationsAdmin;
