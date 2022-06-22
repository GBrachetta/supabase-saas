import '../styles/globals.css';
import Nav from '../components/nav';
import UserProvider from '../context/user';

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Nav />
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
