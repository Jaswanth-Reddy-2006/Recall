import type { Metadata } from 'next';
import './globals.css';
import AgentationWrapper from '../components/AgentationWrapper';

export const metadata: Metadata = {
  title: 'Recall — Your memory, finally organized.',
  description:
    'Capture anything—screenshots, links, notes, or calls. Recall understands, connects the dots, and turns them into actionable insights.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/icon.svg',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-[#FAFBFE] text-slate-900 selection:bg-[#E6007A] selection:text-white">
        {children}
        <AgentationWrapper />
      </body>
    </html>
  );
}
