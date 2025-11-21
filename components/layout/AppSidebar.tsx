'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  Home,
  BarChart3,
  Settings,
  Wallet,
  Moon,
  Sun,
  Monitor,
  DollarSign,
  PiggyBank,
  Trophy,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/layout/ThemeProvider';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from './LanguageSwitcher';

export function AppSidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();
  const { theme, setTheme } = useTheme();
  
  const menuItems = [
    {
      titleKey: 'nav.dashboard',
      url: `/${locale}`,
      icon: Home,
    },
    {
      titleKey: 'nav.income',
      url: `/${locale}/income`,
      icon: DollarSign,
    },
    {
      titleKey: 'nav.analytics',
      url: `/${locale}/analytics`,
      icon: BarChart3,
    },
    {
      titleKey: 'nav.savings',
      url: `/${locale}/savings`,
      icon: PiggyBank,
    },
    {
      titleKey: 'nav.achievements',
      url: `/${locale}/achievements`,
      icon: Trophy,
    },
    {
      titleKey: 'nav.settings',
      url: `/${locale}/settings`,
      icon: Settings,
    },
  ];

  const getThemeIcon = () => {
    if (theme === 'dark') return <Moon className="h-4 w-4" />;
    if (theme === 'light') return <Sun className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  // Set sidebar position based on language direction
  const sidebarSide = locale === 'ar' ? 'right' : 'left';

  return (
    <Sidebar side={sidebarSide}>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wallet className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold">{t('common.appName')}</span>
            <span className="text-xs text-muted-foreground">{t('common.appSubtitle')}</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('nav.dashboard')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={t(item.titleKey)}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{t(item.titleKey)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="p-4 space-y-2">
          <LanguageSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start gap-2">
                {getThemeIcon()}
                <span className="capitalize">{t(`theme.${theme}`)} {t('theme.mode')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="h-4 w-4 mr-2" />
                {t('theme.light')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="h-4 w-4 mr-2" />
                {t('theme.dark')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Monitor className="h-4 w-4 mr-2" />
                {t('theme.system')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

