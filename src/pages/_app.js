import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
import Script from 'next/script';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head>
        <title>E-commerce Project</title>
        <meta name="description" content="E-commerce Project built with Next.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
        strategy="afterInteractive"
      />
      <Component {...pageProps} />
      <ToastContainer />
    </Provider>
  );
}