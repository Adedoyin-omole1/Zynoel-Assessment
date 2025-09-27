import Link from 'next/link';
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout pageTitle="Home">
      <div className="container text-center my-5">
        <h1 className="display-4 mb-4">Welcome to Our E-Store</h1>
        <p className="lead mb-4">
          Discover amazing products at great prices. Shop with confidence and enjoy fast delivery.
        </p>
        <Link href="/products" className="btn btn-primary btn-lg">
          Start Shopping
        </Link>
      </div>
    </Layout>
  );
}