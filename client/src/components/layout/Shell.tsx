import React from 'react';
import { cn } from '@/lib/utils';
import { 
  LayoutGrid,
  Settings
} from 'lucide-react';
import { Link, useLocation } from 'wouter';

interface ShellProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  panel?: React.ReactNode;
}

export function Shell({ children, sidebar, panel }: ShellProps) {
  const [location] = useLocation();

  const mainNavItems = [
    { label: 'Dashboard', icon: LayoutGrid, href: '/dashboard' },
  ];

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-sans text-[#1a1a1a]">
      {/* Side Navigation */}
      <aside className="w-56 border-r border-[#e5e5e5] bg-white flex flex-col">
        <div className="p-6 border-b border-[#e5e5e5]">
          <Link href="/dashboard">
            <h1 className="text-xl font-bold text-[#1a1a1a] cursor-pointer hover:opacity-80 transition-opacity" data-testid="logo">
              Zania
            </h1>
          </Link>
        </div>

        <nav className="flex-1 py-6 px-3">
          <ul className="space-y-1">
            {mainNavItems.map((item, idx) => (
              <li key={idx}>
                <Link href={item.href}>
                  <a
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      location === item.href 
                        ? "bg-[#f5f5f5] text-[#1a1a1a]" 
                        : "text-[#666] hover:text-[#1a1a1a] hover:bg-[#fafafa]"
                    )}
                    data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                  >
                    <item.icon className={cn("w-4 h-4", location === item.href ? "text-[#4A9B8C]" : "")} />
                    {item.label}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-[#e5e5e5]">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-[#f0f0f0] flex items-center justify-center text-xs font-semibold text-[#666]">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1a1a1a] truncate">Jane Doe</p>
              <p className="text-xs text-[#999]">Compliance Lead</p>
            </div>
            <button className="p-2 text-[#999] hover:text-[#666] transition-colors" data-testid="button-settings">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-white">
        {children}
      </main>
    </div>
  );
}
