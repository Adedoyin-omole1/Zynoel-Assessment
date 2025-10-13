import Link from 'next/link';
import CartIcon from '../CartIcon';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    // logics for cart item count.
    const cartItems = useSelector(state => state.cart.items || []);
    const cartItemCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg bg-primary navbar-dark sticky-top">
            <div className="container">
                <Link href="/" legacyBehavior>
                    <a className="navbar-brand fw-bold">Adedoyin-Ecommerce</a>
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
                            <Link href="/" legacyBehavior>
                                <a className={`nav-link ${router.pathname === '/' ? 'active' : ''}`}>Home</a>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/products" legacyBehavior>
                                <a className={`nav-link ${router.pathname.startsWith('/products') ? 'active' : ''}`}>Products</a>
                            </Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a
                                href="#"
                                className="nav-link dropdown-toggle"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Categories
                            </a>
                            <ul className="dropdown-menu">
                                <li>
                                    <Link href="/categories/electronics" legacyBehavior>
                                        <a className="dropdown-item">Electronics</a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/categories/clothing" legacyBehavior>
                                        <a className="dropdown-item">Clothing</a>
                                    </Link>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <Link href="/products" legacyBehavior>
                                        <a className="dropdown-item">All Products</a>
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
