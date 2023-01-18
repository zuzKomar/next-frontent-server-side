import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SSRProvider, Provider, darkTheme } from '@adobe/react-spectrum';
import { SessionProvider } from "next-auth/react";
import { Session } from 'next-auth';

function MyApp({ 
  Component, 
  pageProps: {session, ...pageProps},
 }: AppProps<{session: Session}>) {
  return (
    <SessionProvider session={session} >
        <SSRProvider>
          <Provider theme={darkTheme}>
            <Component {...pageProps} />
          </Provider>
        </SSRProvider>
    </SessionProvider>
  );
}

export default MyApp;
