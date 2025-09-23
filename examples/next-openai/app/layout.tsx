import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import LogoutButton from '@/component/logout-button';

export const metadata = {
  title: 'AI SDK - Next.js OpenAI Examples',
  description: 'Examples of using the AI SDK with Next.js and OpenAI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <LogoutButton />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
