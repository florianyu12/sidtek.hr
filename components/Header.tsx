'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Company } from '@/types';

interface HeaderProps {
  company: Company;
}

export default function Header({ company }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const logoSize = company.logoSize || 48;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showWhiteBg = isScrolled || isHovered;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showWhiteBg
          ? 'bg-white shadow-lg'
          : 'bg-transparent'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={company.logo}
            alt={company.name}
            className={`transition-all duration-300 ${
              showWhiteBg ? '' : 'filter brightness-0 invert'
            }`}
            style={{ height: logoSize, width: 'auto' }}
          />
          <span className={`text-lg md:text-xl font-semibold transition-colors duration-300 ${
            showWhiteBg ? 'text-gray-800' : 'text-white'
          }`}>
            {company.name}
          </span>
        </div>
        <nav className="hidden md:flex items-center space-x-6 md:space-x-8">
          <a href="#home" className={`transition-colors duration-300 ${
            showWhiteBg ? 'text-gray-800 hover:text-secondary' : 'text-white hover:text-gray-300'
          }`}>首页</a>
          <a href="#about" className={`transition-colors duration-300 ${
            showWhiteBg ? 'text-gray-800 hover:text-secondary' : 'text-white hover:text-gray-300'
          }`}>公司简介</a>
          <a href="#campus" className={`transition-colors duration-300 ${
            showWhiteBg ? 'text-gray-800 hover:text-secondary' : 'text-white hover:text-gray-300'
          }`}>校园招聘</a>
          <a href="#social" className={`transition-colors duration-300 ${
            showWhiteBg ? 'text-gray-800 hover:text-secondary' : 'text-white hover:text-gray-300'
          }`}>社会招聘</a>
          <a href="#environment" className={`transition-colors duration-300 ${
            showWhiteBg ? 'text-gray-800 hover:text-secondary' : 'text-white hover:text-gray-300'
          }`}>公司环境</a>
          <a href="#contact" className={`transition-colors duration-300 ${
            showWhiteBg ? 'text-gray-800 hover:text-secondary' : 'text-white hover:text-gray-300'
          }`}>联系我们</a>
          <Link href="/admin" className={`transition-colors duration-300 ${
            showWhiteBg ? 'text-gray-800 hover:text-secondary' : 'text-white hover:text-gray-300'
          }`}>管理</Link>
        </nav>
        <button className={`md:hidden transition-colors duration-300 ${
          showWhiteBg ? 'text-gray-800' : 'text-white'
        }`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
