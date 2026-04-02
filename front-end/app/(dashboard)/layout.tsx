'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LayoutDashboard, Ticket, LogOut, SquareKanban } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Tickets', path: '/tickets', icon: Ticket },
    { name: 'Kanban', path: '/kanban', icon: SquareKanban },
  ];

  return (
    <div className="flex h-screen bg-bg-base text-text-primary overflow-hidden dark">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-bg-surface border-r border-border transform transition-transform duration-200 ease-in-out flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <Link href="/dashboard" className="text-xl font-bold flex items-center gap-2 text-text-primary">
            <Ticket className="w-6 h-6 text-col-todo" />
            <span>Tickets Board</span>
          </Link>
          <button 
            className="md:hidden text-text-secondary hover:text-text-primary"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path}>
                <span className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                  active 
                    ? 'bg-bg-card text-text-primary border border-border text-sm font-medium' 
                    : 'text-text-secondary hover:bg-bg-card-hover hover:text-text-primary text-sm'
                }`}>
                  <Icon className="w-5 h-5" />
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-text-secondary hover:bg-red-500/10 hover:text-red-500 transition-colors text-sm"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        <header className="md:hidden h-16 flex items-center justify-between px-4 bg-bg-surface border-b border-border">
          <Link href="/dashboard" className="font-bold flex items-center gap-2 text-text-primary">
            <Ticket className="w-5 h-5 text-col-todo" />
            <span>Tickets Board</span>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-text-secondary hover:text-text-primary"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 overflow-auto bg-bg-base">
          <div className="p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
