'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Jobs from '@/components/Jobs';
import Environment from '@/components/Environment';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { SiteData } from '@/types';

export default function Home() {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError('加载数据失败');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">{error || '数据加载失败'}</p>
        </div>
      </div>
    );
  }

  return (
    <main>
      <Header company={data.company} />
      <Hero company={data.company} />
      <About company={data.company} />
      <Jobs jobs={data.jobs} />
      <Environment images={data.environmentImages} />
      <Contact contact={data.contact} wechatQrcode={data.wechatQrcode} />
      <Footer company={data.company} />
    </main>
  );
}
