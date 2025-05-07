import "../styles/globals.css";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  // This is optional: helps ensure body class is removed on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
