'use client';

import SettingSidebar from "@/components/setting-sidebar";

export default function SettingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SettingSidebar />
      {children}
    </div>
  );
}
