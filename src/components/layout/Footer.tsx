import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLocalized } from '@/hooks/useLocalized';

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const { getLocalizedField } = useLocalized();

  const { data: siteSettings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      if (error) throw error;
      return data?.reduce((acc, item) => {
        acc[item.key] = item;
        return acc;
      }, {} as Record<string, typeof data[0]>);
    },
  });

  const { data: navItems } = useQuery({
    queryKey: ['nav-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nav_items')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  const quickLinks = navItems?.map((item) => ({
    path: item.path,
    label: getLocalizedField(item, 'label'),
  })) || [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/courses', label: t('nav.courses') },
    { path: '/admission', label: t('nav.admission') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'Youtube' },
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      try {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .insert({ email });

        if (error) {
          if (error.code === '23505') {
            toast.info('You are already subscribed!');
          } else {
            throw error;
          }
        } else {
          toast.success('Thank you for subscribing!');
        }
        setEmail('');
      } catch (error) {
        console.error('Error subscribing:', error);
        toast.error('Failed to subscribe. Please try again.');
      }
    }
  };

  const siteName = siteSettings?.site_name 
    ? getLocalizedField(siteSettings.site_name, 'value')
    : 'Yidai Yilu';

  const siteTagline = siteSettings?.site_tagline
    ? getLocalizedField(siteSettings.site_tagline, 'value')
    : '一带一路中文学院';

  const footerDescription = siteSettings?.footer_description
    ? getLocalizedField(siteSettings.footer_description, 'value')
    : t('footer.description');

  const address = siteSettings?.contact_address
    ? getLocalizedField(siteSettings.contact_address, 'value')
    : t('footer.address');

  const phone = siteSettings?.contact_phone?.value_en || t('footer.phone');
  const emailAddress = siteSettings?.contact_email?.value_en || t('footer.email');
  const logoUrl = siteSettings?.logo?.image_url;

  return (
    <footer className="bg-[#1A1A1A] text-white">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {logoUrl ? (
                <img src={logoUrl} alt={siteName} className="h-10 w-10 rounded-lg object-cover" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0A6B4E] text-white font-bold text-lg">
                  易
                </div>
              )}
              <div>
                <span className="font-bold text-lg text-[#0A6B4E]">{siteName}</span>
                <span className="block text-xs text-gray-400">{siteTagline}</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {footerDescription}
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gray-400 hover:bg-[#0A6B4E] hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-[#0A6B4E] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">{t('footer.contactInfo')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="h-5 w-5 shrink-0 text-[#0A6B4E]" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="h-5 w-5 shrink-0 text-[#0A6B4E]" />
                <span>{phone}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="h-5 w-5 shrink-0 text-[#0A6B4E]" />
                <span>{emailAddress}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">{t('footer.newsletter')}</h4>
            <p className="text-sm text-gray-400">
              {t('footer.newsletterDesc')}
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
              />
              <Button type="submit" size="icon" className="shrink-0 bg-[#0A6B4E] hover:bg-[#0A6B4E]/90">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>{t('footer.copyright')}</p>
          <p>{t('footer.affiliatedWith')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
