'use client';
import { Suspense, useState, useEffect, useRef } from 'react';
import Sidebar from '../sidebar';
import Header from '../header';
import { usePathname } from 'next/navigation';
import { PATHS_WITH_SIDEBAR } from '@/constants/paths';
import { Toaster } from 'sonner';

function MainLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (PATHS_WITH_SIDEBAR.includes(pathname)) {
    return (
      <Suspense
        fallback={
          <div
            className="flex justify-center items-center w-full h-screen text-lg"
            aria-label="Loading dashboard"
          >
            <span className="visually-hidden">Loading dashboard content</span>
            Loading...
          </div>
        }
      >
        <main className="flex w-full min-h-[100dvh]">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            isMobile={isMobile}
            hamburgerRef={hamburgerRef}
          />
          <div className="flex-1 flex flex-col md:ml-[219px]">
            <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} hamburgerRef={hamburgerRef} />
            {children}
          </div>
          <Toaster duration={2500} richColors closeButton position="top-center" />
        </main>
      </Suspense>
    );
  } else {
    return <>{children}</>;
  }
}

export default MainLayout;
