'use client';

import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-base text-text-primary py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary leading-none">
              Tickets <span className="text-col-todo">Board</span>
            </h2>
        </div>
        {children}
      </div>
    </div>
  );
}
