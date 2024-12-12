import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gerador de Amigo Secreto',
  description: 'O melhor gerador de amigo secreto online!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen w-full">
        <div className="max-w-[calc(760px+2*20px)] px-[20px] ml-auto mr-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
