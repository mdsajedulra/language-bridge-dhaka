import React from 'react';
import '@/i18n/config';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from '@/contexts/AuthContext';
import Index from "./pages/Index";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Admission from "./pages/Admission";
import Notice from "./pages/Notice";
import Job from "./pages/Job";
import Alumni from "./pages/Alumni";
import HSK from "./pages/HSK";
import Campus from "./pages/Campus";
import Videos from "./pages/Videos";
import Contact from "./pages/Contact";
import Books from "./pages/Books";
import Teachers from "./pages/Teachers";
import Auth from "./pages/Auth";
import LegalPage from "./pages/LegalPage";
import Dashboard from "./pages/admin/Dashboard";
import CoursesAdmin from "./pages/admin/CoursesAdmin";
import SettingsAdmin from "./pages/admin/SettingsAdmin";
import ContactsAdmin from "./pages/admin/ContactsAdmin";
import ApplicationsAdmin from "./pages/admin/ApplicationsAdmin";
import NavigationAdmin from "./pages/admin/NavigationAdmin";
import HeroAdmin from "./pages/admin/HeroAdmin";
import TestimonialsAdmin from "./pages/admin/TestimonialsAdmin";
import NoticesAdmin from "./pages/admin/NoticesAdmin";
import JobsAdmin from "./pages/admin/JobsAdmin";
import AlumniAdmin from "./pages/admin/AlumniAdmin";
import ServicesAdmin from "./pages/admin/ServicesAdmin";
import PartnersAdmin from "./pages/admin/PartnersAdmin";
import GalleryAdmin from "./pages/admin/GalleryAdmin";
import BooksAdmin from "./pages/admin/BooksAdmin";
import MediaAdmin from "./pages/admin/MediaAdmin";
import VideosAdmin from "./pages/admin/VideosAdmin";
import TranslationsAdmin from "./pages/admin/TranslationsAdmin";
import TeachersAdmin from "./pages/admin/TeachersAdmin";
import BackupRestoreAdmin from "./pages/admin/BackupRestoreAdmin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/admission" element={<Admission />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/job" element={<Job />} />
            <Route path="/alumni" element={<Alumni />} />
            <Route path="/hsk" element={<HSK />} />
            <Route path="/campus" element={<Campus />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/books" element={<Books />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/privacy-policy" element={<LegalPage type="privacy" />} />
            <Route path="/terms-of-service" element={<LegalPage type="terms" />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/settings" element={<SettingsAdmin />} />
            <Route path="/admin/navigation" element={<NavigationAdmin />} />
            <Route path="/admin/hero" element={<HeroAdmin />} />
            <Route path="/admin/courses" element={<CoursesAdmin />} />
            <Route path="/admin/testimonials" element={<TestimonialsAdmin />} />
            <Route path="/admin/notices" element={<NoticesAdmin />} />
            <Route path="/admin/jobs" element={<JobsAdmin />} />
            <Route path="/admin/alumni" element={<AlumniAdmin />} />
            <Route path="/admin/services" element={<ServicesAdmin />} />
            <Route path="/admin/partners" element={<PartnersAdmin />} />
            <Route path="/admin/gallery" element={<GalleryAdmin />} />
            <Route path="/admin/books" element={<BooksAdmin />} />
            <Route path="/admin/media" element={<MediaAdmin />} />
            <Route path="/admin/videos" element={<VideosAdmin />} />
            <Route path="/admin/translations" element={<TranslationsAdmin />} />
            <Route path="/admin/contacts" element={<ContactsAdmin />} />
            <Route path="/admin/applications" element={<ApplicationsAdmin />} />
            <Route path="/admin/teachers" element={<TeachersAdmin />} />
            <Route path="/admin/backup-restore" element={<BackupRestoreAdmin />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
