import React from 'react';
import { useStore } from '@/hooks/useStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PanelRight, Menu, ChevronDown, Users as UsersIcon, Globe, MessageSquare, LayoutGrid } from 'lucide-react';
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

  const navItems = [
    { label: 'All agents', icon: LayoutGrid, href: '/agents' },
    { label: 'All roles', icon: UsersIcon },
    { label: 'All users', icon: UsersIcon },
    { label: 'All sources', icon: Globe },
    { label: 'All feedback', icon: MessageSquare },
  ];

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden font-sans text-foreground">
      {/* Top Header Navigation */}
      <header className="h-14 flex items-center px-4 border-b border-border bg-background/50 backdrop-blur-md z-30 sticky top-0">
        <div className="flex items-center gap-6 flex-1">
          <Link href="/dashboard">
            <img src={logoImage} alt="Zania logo" className="h-6 w-auto cursor-pointer hover:opacity-80 transition-opacity" />
          </Link>
          
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item, idx) => (
              <Link key={idx} href={item.href || '#'}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-9 px-3 gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 font-normal",
                    location === item.href && "text-foreground font-medium bg-secondary/30"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" onClick={() => setSourcePanelOpen(!isSourcePanelOpen)}>
            <PanelRight className="h-5 w-5" />
          </Button>
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
            JD
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar - Left */}
        <aside className={cn(
          "flex-shrink-0 w-64 bg-background/30 border-r border-border flex flex-col transition-all duration-300 ease-in-out z-20",
          "fixed inset-y-0 left-0 md:relative md:translate-x-0 pt-0",
          !isMobileMenuOpen && "-translate-x-full"
        )}>
          <div className="flex-1 overflow-y-auto py-4">
            {sidebar}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col relative min-w-0 overflow-hidden background-grid">
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto relative scroll-smooth z-0">
             {children}
          </div>
        </main>

        {/* Right Panel - Sources */}
        <aside className={cn(
          "flex-shrink-0 bg-card border-l border-border flex flex-col transition-all duration-300 ease-in-out shadow-xl md:shadow-none z-20",
          "fixed inset-y-0 right-0 md:relative",
          isSourcePanelOpen ? "w-[320px] translate-x-0" : "w-0 translate-x-full md:translate-x-0 md:w-0 overflow-hidden"
        )}>
          {panel}
        </aside>

        {/* Mobile Overlay */}
        {(isMobileMenuOpen || (isSourcePanelOpen && window.innerWidth < 768)) && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10 md:hidden"
            onClick={() => {
              setMobileMenuOpen(false);
              setSourcePanelOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
