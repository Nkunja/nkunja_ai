import type { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react";
import { ChatProvider } from '../contexts/ChatContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ChatProvider>
        <Component {...pageProps} />
      </ChatProvider>
    </SessionProvider>
  );
}

export default MyApp;