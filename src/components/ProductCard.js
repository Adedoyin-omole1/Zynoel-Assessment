import Link from 'next/link';
import { Card, Button } from 'react-bootstrap';

export default function ProductCard({ product }) {
    const id = product?.id ?? product?.product_id;
    const image = product?.image ?? null;
    const name = product?.name ?? 'Unnamed Product';
    const description = product?.description ?? '';
    const price = Number(product?.price ?? 0) || 0;
    const availability = product?.availability !== false && product?.availability !== 'out of stock';

    if (!id) {
        console.error('Product missing ID:', product);
        return null;
    }

    return (
        <Card className="h-100 shadow-sm">
            {image ? (
                <Card.Img variant="top" src={image} alt={name} style={{ height: '200px', objectFit: 'cover' }} />
            ) : (
                <div style={{ height: '200px', background: '#f5f5f5' }} />
            )}
            <Card.Body className="d-flex flex-column">
                <Card.Title className="h6">{name}</Card.Title>
                <Card.Text className="flex-grow-1 small">
                    {description ? (description.length > 100 ? description.slice(0, 100) + '...' : description) : "No description available"}
                </Card.Text>
                <Card.Text className="h5 text-primary">
                    <strong>${price.toFixed(2)}</strong>
                </Card.Text>
                <Card.Text className={availability ? 'text-success' : 'text-danger'}>
                    <small>{availability ? 'In Stock' : 'Out of Stock'}</small>
                </Card.Text>

                <Link href={`/products/${id}`} className="d-grid mt-2">
                    <Button variant="primary" size="sm">View Details</Button>
                </Link>
            </Card.Body>
        </Card>
    );
}
