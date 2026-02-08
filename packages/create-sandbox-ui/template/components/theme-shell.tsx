"use client";

import { Navbar } from "./ui/navbar";

export function ThemeShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col overflow-y-auto" style={{ scrollBehavior: "smooth" }}>
      <div className="px-4 sm:px-6 pt-4 pb-2 sticky top-0 z-40">
        <div className="mx-auto max-w-6xl">
          <Navbar />
        </div>
      </div>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
