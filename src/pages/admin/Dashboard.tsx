import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpen,
  MessageSquare,
  Bell,
  Briefcase,
  Mail,
  GraduationCap,
  Users,
  Newspaper,
} from 'lucide-react';

const Dashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [courses, testimonials, notices, jobs, contacts, applications, alumni, media] = await Promise.all([
        supabase.from('courses').select('id', { count: 'exact', head: true }),
        supabase.from('testimonials').select('id', { count: 'exact', head: true }),
        supabase.from('notices').select('id', { count: 'exact', head: true }),
        supabase.from('jobs').select('id', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('admission_applications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('alumni').select('id', { count: 'exact', head: true }),
        supabase.from('media').select('id', { count: 'exact', head: true }),
      ]);

      return {
        courses: courses.count || 0,
        testimonials: testimonials.count || 0,
        notices: notices.count || 0,
        jobs: jobs.count || 0,
        unreadContacts: contacts.count || 0,
        pendingApplications: applications.count || 0,
        alumni: alumni.count || 0,
        media: media.count || 0,
      };
    },
  });

  const statCards = [
    { title: 'Courses', value: stats?.courses || 0, icon: BookOpen, color: 'bg-blue-500' },
    { title: 'Testimonials', value: stats?.testimonials || 0, icon: MessageSquare, color: 'bg-green-500' },
    { title: 'Notices', value: stats?.notices || 0, icon: Bell, color: 'bg-yellow-500' },
    { title: 'Jobs', value: stats?.jobs || 0, icon: Briefcase, color: 'bg-purple-500' },
    { title: 'Unread Messages', value: stats?.unreadContacts || 0, icon: Mail, color: 'bg-red-500' },
    { title: 'Pending Applications', value: stats?.pendingApplications || 0, icon: GraduationCap, color: 'bg-orange-500' },
    { title: 'Alumni', value: stats?.alumni || 0, icon: Users, color: 'bg-indigo-500' },
    { title: 'Media', value: stats?.media || 0, icon: Newspaper, color: 'bg-teal-500' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your admin dashboard</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Use the sidebar menu to manage your website content.
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                <li>Update site settings and logo</li>
                <li>Manage courses and programs</li>
                <li>Add student testimonials</li>
                <li>Post notices and job openings</li>
                <li>View contact form submissions</li>
                <li>Review admission applications</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Management Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                All content supports 3 languages:
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                <li>English (EN)</li>
                <li>বাংলা (BN)</li>
                <li>中文 (ZH)</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                Make sure to fill in translations for all languages to provide a complete experience.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
