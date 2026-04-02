'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="bg-gradient-to-br  flex items-center justify-center ">
      <div className="w-full max-w-md">
        <div className=" rounded-lg shadow-lg ">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}



