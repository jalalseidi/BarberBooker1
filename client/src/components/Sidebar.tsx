import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { 
  Home, 
  Scissors, 
  Users, 
  Calendar, 
  User,
  Settings
} from "lucide-react";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const menuItems = [
    {
      icon: Home,
      label: t('nav.home'),
      path: '/',
    },
    {
      icon: Calendar,
      label: t('nav.bookings'),
      path: '/bookings',
    },
    {
      icon: Scissors,
      label: t('nav.services'),
      path: '/services',
    },
    {
      icon: Users,
      label: t('nav.barbers'),
      path: '/barbers',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-full w-64 flex-col bg-background border-r">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <Scissors className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">BarberShop</span>
        </div>
      </div>
      
      <Separator />
      
      <nav className="flex-1 space-y-2 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "default" : "ghost"}
              className="w-full justify-start gap-3"
              onClick={() => navigate(item.path)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
      
      <Separator />
      
      <div className="p-4 space-y-2">
        <Button variant="ghost" className="w-full justify-start gap-3">
          <User className="h-4 w-4" />
          {t('nav.profile')}
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
}