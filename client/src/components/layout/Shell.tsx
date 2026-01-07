import React from 'react';
import { useStore } from '@/hooks/useStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  PanelRight, 
  Menu, 
  ChevronDown, 
  Users as UsersIcon, 
  Globe, 
  MessageSquare, 
  LayoutGrid,
  Search,
  Bell,
  UserCircle,
  Clock,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Settings,
  LogOut,
  Filter
} from 'lucide-react';
import logoImage from '@assets/image_1766197243611.png';
import { Link, useLocation } from 'wouter';

interface ShellProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  panel?: React.ReactNode;
}

export function Shell({ children, sidebar, panel }: ShellProps) {
  const { isSourcePanelOpen, setSourcePanelOpen } = useStore();
  const [isMobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [location] = useLocation();

  const mainNavItems = [
    { label: 'Dashboard', icon: LayoutGrid, href: '/dashboard' },
    { label: 'All agents', icon: UsersIcon, href: '/agents' },
    { label: 'Search', icon: Search, href: '/search' },
  ];

  const quickFilters = [
    { label: 'My Decisions', icon: UsersIcon, color: 'text-primary' },
    { label: 'Urgent (< 24h)', icon: Clock, color: 'text-destructive' },
    { label: 'Awaiting Input', icon: AlertCircle, color: 'text-amber-500' },
    { label: 'Recent Completions', icon: CheckCircle2, color: 'text-green-500' },
  ];

  const riskFilters = [
    { label: 'Vendor Risk' },
    { label: 'Compliance' },
    { label: 'Security' },
    { label: 'Internal Controls' },
  ];

  return (
    <div className="flex h-screen w-full bg-[#F6F3EE] overflow-hidden font-sans text-[#2F2A26]">
      {/* Side Navigation */}
      <aside className="w-64 border-r border-[#B7C3B0]/30 bg-white/50 backdrop-blur-md flex flex-col z-40">
        <div className="p-6 border-b border-[#B7C3B0]/20">
          <Link href="/dashboard">
            <img src={logoImage} alt="Zania logo" className="h-7 w-auto cursor-pointer hover:opacity-80 transition-opacity" />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-8 no-scrollbar">
          {/* Main Navigation */}
          <nav className="px-3 space-y-1">
            {mainNavItems.map((item, idx) => (
              <Link key={idx} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-10 font-medium transition-all group relative",
                    location === item.href 
                      ? "bg-[#B7C3B0]/20 text-[#2F2A26]" 
                      : "text-[#2F2A26]/60 hover:text-[#2F2A26] hover:bg-[#B7C3B0]/10"
                  )}
                >
                  <item.icon className={cn("w-4 h-4", location === item.href ? "text-primary" : "opacity-70 group-hover:opacity-100")} />
                  <span className="text-sm">{item.label}</span>
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-[#B7C3B0]/20 bg-white/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-[#B7C3B0]/30 flex items-center justify-center border border-[#B7C3B0]/50 font-black text-[10px]">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">Jane Doe</p>
              <p className="text-[10px] text-[#2F2A26]/60 font-medium">Compliance Lead</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-40 hover:opacity-100">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 bg-white/10 backdrop-blur-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
          {children}
        </div>

        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
