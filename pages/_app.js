// pages/_app.js
import Layout from "../components/Layout";
import "react-datepicker/dist/react-datepicker.css";



export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

