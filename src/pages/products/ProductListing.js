import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/slices/productSlice';
import ProductCard from '../../components/ProductCard';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import Head from 'next/head';

export default function ProductsPage() {
    const dispatch = useDispatch();
    const { items, status, error } = useSelector(state => state.products);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProducts());
        }
    }, [status, dispatch]);

    if (status === 'loading') {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (status === 'failed') {
        return (
            <Container className="py-4">
                <Alert variant="danger">
                    Error loading products: {error}
                </Alert>
            </Container>
        );
    }

    return (
        <>
            <Container className="my-4">
                <h1 className="mb-4">Our Products</h1>
                {items.length === 0 ? (
                    <Alert variant="info">No products available.</Alert>
                ) : (
                    <Row className="g-4">
                        {items.map(product => (
                            <Col key={product.id} sm={6} md={4} lg={3}>
                                <ProductCard product={product} />
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </>
    );
}