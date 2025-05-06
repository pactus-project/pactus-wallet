'use client'
import { Suspense } from 'react';
import Sidebar from '../sidebar';
import Header from '../header';
import { usePathname } from 'next/navigation';
import { PATHS_WITH_SIDEBAR } from '@/constants/paths';

function MainLayout({ children }) {
  const pathname = usePathname();
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
          <Sidebar />
          <div className="flex-1 flex flex-col ml-[219px]">
            <Header />
            {children}
          </div>
        </main>
      </Suspense>
    );
  } else {
    return <>{children}</>;
  }
}

export default MainLayout;
