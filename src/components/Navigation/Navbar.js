import Link from 'next/link';
import CartIcon from '../CartIcon';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    // logic for cart item count.
    const cartItems = useSelector(state => state.cart.items);
    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg bg-primary navbar-dark sticky-top">
            <div className="container">
                <Link href="/" className="navbar-brand fw-bold">
                    Adedoyin-Ecommerce
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link
                                href="/"
                                className={`nav-link ${router.pathname === '/' ? 'active' : ''}`}
                            >
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                href="/products"
                                className={`nav-link ${router.pathname.startsWith('/products') ? 'active' : ''}`}
                            >
                                Products
                            </Link>
                        </li>
                        <li className="nav-item dropdown">
                            <Link
                                href="#"
                                className="nav-link dropdown-toggle"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Categories
                            </Link>
                            <ul className="dropdown-menu">
                                <li>
                                    <Link href="/categories/electronics" className="dropdown-item">
                                        Electronics
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/categories/clothing" className="dropdown-item">
                                        Clothing
                                    </Link>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <Link href="/products" className="dropdown-item">
                                        All Products
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <form className="d-flex me-3" role="search" onSubmit={handleSearch}>
                        <div className="input-group">
                            <input
                                className="form-control"
                                type="search"
                                placeholder="Search products..."
                                aria-label="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="btn btn-outline-light" type="submit">
                                Search
                            </button>
                        </div>
                    </form>
                    <div className="nav-item ms-lg-2">
                        <CartIcon count={cartItemCount} />
                    </div>
                </div>
            </div>
        </nav>
    );
}