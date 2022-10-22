import "../styles/globals.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <ToastContainer limit={1} />
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
