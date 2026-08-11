import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CodeVerse — AI-Native 3D Software Universe',
  description:
    'Transforming software repositories into interactive 3D universes with AI repository understanding, dependency graph physics, and live telemetry.',
  keywords: [
    '3D Universe',
    'Software Architecture',
    'Next.js',
    'Three.js',
    'React Three Fiber',
    'AI Coding Agent',
    'RAG',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark font-sans">
      <body className="bg-slate-950 text-slate-100 antialiased h-screen w-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
