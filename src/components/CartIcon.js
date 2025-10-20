import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CartIcon({ count = 0 }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <Link
            href="/cart"
            className="nav-link position-relative text-light"
            aria-label="View cart"
        >
            <i className="bi bi-cart3 fs-4" aria-hidden="true"></i>

            {/* Render badge only after client mount to prevent hydration mismatch */}
            {mounted && count > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {count}
                    <span className="visually-hidden">items in cart</span>
                </span>
            )}
        </Link>
    );
}
