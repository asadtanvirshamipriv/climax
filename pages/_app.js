import React,{ useState } from 'react';
import '/styles/globals.css';
import '../styles/main.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import MainLayout from '/components/Shared/MainLayout';
import Loader from '/components/shared/Loader';
import Router, { useRouter  } from 'next/router';
import { store } from '/redux/store';
import { Provider } from 'react-redux';

function MyApp({ Component, pageProps:{ session, ...pageProps }, }) {

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  Router.events.on("routeChangeStart", () => { setLoading(true) });
  Router.events.on("routeChangeComplete", () => { setLoading(false)});

  return (
      <> 
      { router.pathname !='/login' && 
          <Provider store={store}>
          <MainLayout>
              { loading && <Loader/> }
              { !loading && <Component {...pageProps} /> }
          </MainLayout>
          </Provider>
      }
      { router.pathname =='/login' &&
        <Component {...pageProps} />
      }
      </>
  )
}

export default MyApp;