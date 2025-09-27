import Link from 'next/link';
import { Card, Button } from 'react-bootstrap';

export default function ProductCard({ product }) {
    const {
        id,
        image,
        name,
        description,
        price,
        availability
    } = product;

    return (
        <Card className="h-100 shadow-sm">
            <Card.Img
                variant="top"
                src={image}
                alt={name}
                style={{ height: '200px', objectFit: 'cover' }}
            />
            <Card.Body className="d-flex flex-column">
                <Card.Title className="h6">{name}</Card.Title>
                <Card.Text className="flex-grow-1 small">
                    {description?.slice(0, 100)}
                    {description?.length > 100 && '...'}
                </Card.Text>
                <Card.Text className="h5 text-primary"><strong>${price.toFixed(2)}</strong></Card.Text>
                <Card.Text className={availability ? 'text-success' : 'text-danger'}>
                    <small>{availability ? 'In Stock' : 'Out of Stock'}</small>
                </Card.Text>
                <Link href={`/products/${id}`} className="d-grid">
                    <Button variant="primary" size="sm">View Details</Button>
                </Link>
            </Card.Body>
        </Card>
    );
}