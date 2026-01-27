import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

const Header = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/courses', label: t('nav.courses') },
    { path: '/admission', label: t('nav.admission') },
    { path: '/notice', label: t('nav.notice') },
    { path: '/job', label: t('nav.job') },
    { path: '/alumni', label: t('nav.alumni') },
    { path: '/hsk', label: t('nav.hsk') },
    { path: '/campus', label: t('nav.campus') },
    { path: '/videos', label: t('nav.videos') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
  };

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
            易
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-lg text-primary">Yidai Yilu</span>
            <span className="block text-xs text-muted-foreground">一带一路中文学院</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.slice(0, 7).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground',
                location.pathname === item.path && 'bg-accent text-accent-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                More <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {navItems.slice(7).map((item) => (
                <DropdownMenuItem key={item.path} asChild>
                  <Link to={item.path}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <span className="text-lg">{currentLanguage.flag}</span>
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">{currentLanguage.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={cn(
                    'gap-2 cursor-pointer',
                    i18n.language === lang.code && 'bg-accent'
                  )}
                >
                  <span className="text-lg">{lang.flag}</span>
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Enroll Button */}
          <Button asChild className="hidden sm:flex bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link to="/admission">{t('nav.enrollNow')}</Link>
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t bg-background">
          <nav className="container py-4 flex flex-col space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  'px-4 py-3 text-sm font-medium rounded-md transition-colors hover:bg-accent',
                  location.pathname === item.path && 'bg-accent text-accent-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
            <Button asChild className="mt-4 bg-accent hover:bg-accent/90">
              <Link to="/admission" onClick={() => setIsMenuOpen(false)}>
                {t('nav.enrollNow')}
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
