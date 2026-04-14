import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Amazon.in: Online Shopping India',
  description: 'Amazon.in - Online Shopping India - Buy mobiles, laptops, cameras, books, watches, apparel, shoes and more at best prices.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-amzn antialiased">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#131921',
              color: '#fff',
              fontSize: '14px',
              borderRadius: '4px',
              padding: '12px 20px',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
