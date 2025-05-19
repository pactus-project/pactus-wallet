'use client';
import { Suspense, useState, useEffect } from 'react';
import Sidebar from '../sidebar';
import Header from '../header';
import { usePathname } from 'next/navigation';
import { PATHS_WITH_SIDEBAR } from '@/constants/paths';
import { Toaster } from 'sonner';

function MainLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
          {isMobile && (
            <button
              className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          )}
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            isMobile={isMobile}
          />
          <div className="flex-1 flex flex-col md:ml-[219px]">
            <Header />
            {children}
          </div>
          <Toaster
            duration={2500}
            richColors
            closeButton
            position="top-center"
          />
        </main>
      </Suspense>
    );
  } else {
    return <>{children}</>;
  }
}

export default MainLayout;
