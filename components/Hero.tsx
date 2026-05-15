'use client';

import { Company } from '@/types';

interface HeroProps {
  company: Company;
}

export default function Hero({ company }: HeroProps) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${company.backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-primary/70"></div>
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">{company.name}</h1>
        <p className="text-2xl md:text-3xl mb-12 text-secondary">{company.slogan}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#campus"
            className="px-8 py-4 bg-secondary hover:bg-secondary/80 text-white font-semibold rounded-lg transition-colors"
          >
            校园招聘
          </a>
          <a
            href="#social"
            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white transition-colors"
          >
            社会招聘
          </a>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
