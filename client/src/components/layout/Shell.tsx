import React from 'react';
import { useStore } from '@/hooks/useStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PanelRight, Menu } from 'lucide-react';

interface ShellProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  panel?: React.ReactNode;
}

export function Shell({ children, sidebar, panel }: ShellProps) {
  const { isSourcePanelOpen, setSourcePanelOpen } = useStore();
  const [isMobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans text-foreground">
      {/* Sidebar - Left */}
      <aside className={cn(
        "flex-shrink-0 w-64 bg-background border-r border-border flex flex-col transition-all duration-300 ease-in-out z-20",
        "fixed inset-y-0 left-0 md:relative md:translate-x-0",
        !isMobileMenuOpen && "-translate-x-full"
      )}>
        <div className="h-16 flex items-center px-6 border-b border-border/50">
          <div className="w-8 h-8 bg-primary rounded-lg mr-3 flex items-center justify-center text-primary-foreground font-bold font-heading">Z</div>
          <span className="font-heading font-semibold text-lg tracking-tight">Zania</span>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          {sidebar}
        </div>
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-medium">JD</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Jane Doe</p>
              <p className="text-xs text-muted-foreground truncate">jane@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative min-w-0 bg-background/50">
        {/* Mobile Header */}
        <header className="h-16 flex md:hidden items-center px-4 border-b border-border bg-background z-10">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
          <span className="ml-3 font-heading font-semibold">Zania</span>
          <div className="ml-auto">
            <Button variant="ghost" size="icon" onClick={() => setSourcePanelOpen(!isSourcePanelOpen)}>
              <PanelRight className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto relative scroll-smooth">
           {/* Gradient Overlay for depth */}
           <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
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
  );
}
