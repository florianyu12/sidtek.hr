'use client';

import { Company } from '@/types';

interface FooterProps {
  company: Company;
}

export default function Footer({ company }: FooterProps) {
  return (
    <footer className="bg-primary/95 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <img src={company.logo} alt={company.name} className="h-8 mx-auto mb-4 opacity-80" />
        <p className="text-gray-400">© {new Date().getFullYear()} {company.name} 版权所有</p>
      </div>
    </footer>
  );
}
