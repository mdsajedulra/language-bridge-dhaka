import { ReactNode, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Settings,
  BookOpen,
  GraduationCap,
  MessageSquare,
  Bell,
  Briefcase,
  Users,
  Image,
  Video,
  Handshake,
  FileText,
  Mail,
  Newspaper,
  Languages,
  Navigation,
  DatabaseBackup,
  Home,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/settings', label: 'Site Settings', icon: Settings },
  { path: '/admin/navigation', label: 'Navigation', icon: Navigation },
  { path: '/admin/hero', label: 'Hero Section', icon: Home },
  { path: '/admin/courses', label: 'Courses', icon: BookOpen },
  { path: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
  { path: '/admin/notices', label: 'Notices', icon: Bell },
  { path: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { path: '/admin/alumni', label: 'Alumni', icon: GraduationCap },
  { path: '/admin/teachers', label: 'Teachers', icon: GraduationCap },
  { path: '/admin/services', label: 'Services', icon: Users },
  { path: '/admin/partners', label: 'Partners', icon: Handshake },
  { path: '/admin/gallery', label: 'Gallery', icon: Image },
  { path: '/admin/books', label: 'Books', icon: FileText },
  { path: '/admin/media', label: 'Media', icon: Newspaper },
  { path: '/admin/videos', label: 'Videos', icon: Video },
  { path: '/admin/translations', label: 'Translations', icon: Languages },
  { path: '/admin/contacts', label: 'Contact Messages', icon: Mail },
  { path: '/admin/applications', label: 'Applications', icon: GraduationCap },
  { path: '/admin/backup-restore', label: 'Backup & Restore', icon: DatabaseBackup },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-background border-b">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0A6B4E] text-white font-bold text-sm">
            易
          </div>
          <span className="font-semibold">Admin</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform lg:translate-x-0 lg:static',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-4 border-b hidden lg:block">
              <Link to="/" className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0A6B4E] text-white font-bold text-lg">
                  易
                </div>
                <div>
                  <span className="font-bold text-lg">Admin Panel</span>
                  <span className="block text-xs text-muted-foreground">Yidai Yilu</span>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 py-4">
              <nav className="space-y-1 px-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-[#0A6B4E] text-white'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </ScrollArea>

            {/* Footer */}
            <div className="p-4 border-t space-y-2">
              <Link to="/">
                <Button variant="outline" className="w-full justify-start">
                  <Home className="mr-2 h-4 w-4" />
                  View Website
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
