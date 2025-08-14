// pages/_app.js
import '../styles/globals.css'
import Link from 'next/link'
import Layout from "../components/Layout";
import { useState } from 'react'

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
