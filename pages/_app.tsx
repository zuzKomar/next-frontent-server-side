import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SSRProvider, Provider, defaultTheme, darkTheme } from '@adobe/react-spectrum';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SSRProvider>
      <Provider theme={darkTheme}>
        <Component {...pageProps} />
      </Provider>
    </SSRProvider>
  );
}

export default MyApp;
