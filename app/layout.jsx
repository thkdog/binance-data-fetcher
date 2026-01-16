import './globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { IBM_Plex_Sans } from 'next/font/google';
import { Providers } from './providers';

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'Binance Kline Downloader',
  description: 'Download Binance spot and futures klines as CSV.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={plexSans.className}>
        <AntdRegistry>
          <Providers>{children}</Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
