import Link from 'next/link';

export default function CartIcon({ count = 0 }) {
    return (
        <Link href="/cart" className="nav-link position-relative text-light">
            <i className="bi bi-cart3 fs-4"></i>
            {count > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {count}
                    <span className="visually-hidden">items in cart</span>
                </span>
            )}
        </Link>
    );
}