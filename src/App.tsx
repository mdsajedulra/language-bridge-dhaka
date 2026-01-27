import '@/i18n/config';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
