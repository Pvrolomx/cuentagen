import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CuentaGen | Expat Advisor MX',
  description: 'Generador de cuentas de cobro',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
