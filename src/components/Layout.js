import Footer from './Navigation/Footer';
import Navbar from './Navigation/Navbar';
import Head from 'next/head';
import React from 'react';

const Layout = ({ children, pageTitle }) => {
    return (
        <>
            <Head>
                <title>{pageTitle ? `${pageTitle} | E-commerce Project` : 'E-commerce Project'}</title>
                <meta name="description" content="E-commerce Project built with Next.js" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />
            <main style={{ minHeight: 'calc(100vh - 200px)' }}>{children}</main>
            <Footer />
        </>
    );
}

export default Layout;