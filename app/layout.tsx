import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '熙泰科技招聘官网',
  description: '熙泰科技招聘信息，校园招聘，社会招聘',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
