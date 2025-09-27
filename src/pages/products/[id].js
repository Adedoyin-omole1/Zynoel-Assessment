import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { fetchProducts } from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import { Container, Row, Col, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function ProductDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const dispatch = useDispatch();
    const { items, status, error } = useSelector(state => state.products);

    const product = items.find(p => p.id === Number(id));

    useEffect(() => {
        if (id && items.length === 0 && status === 'idle') {
            dispatch(fetchProducts());
        }
    }, [dispatch, items.length, status, id]);

    if (status === 'loading' || !router.isReady) {
        return (
            <Layout pageTitle="Loading...">
                <Container className="text-center py-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Container>
            </Layout>
        );
    }

    if (status === 'failed') {
        return (
            <Layout pageTitle="Error">
                <Container className="my-4">
                    <Alert variant="danger">
                        Error loading products: {error}
                        <div className="mt-3">
                            <Button variant="primary" onClick={() => router.push('/products')}>
                                Return to Products
                            </Button>
                        </div>
                    </Alert>
                </Container>
            </Layout>
        );
    }

    if (!product) {
        return (
            <Layout pageTitle="Product Not Found">
                <Container className="my-4">
                    <Alert variant="warning">
                        <Alert.Heading>Product Not Found</Alert.Heading>
                        <p>The product you're looking for doesn't exist or has been removed.</p>
                        <Button variant="primary" onClick={() => router.push('/products')}>
                            Return to Products
                        </Button>
                    </Alert>
                </Container>
            </Layout>
        );
    }

    const handleAddToCart = () => {
        dispatch(addToCart(product));
        toast.success('Added to cart!', {
            position: "top-right",
            autoClose: 2000
        });
    };

    return (
        <Layout pageTitle={product.name}>
            <Head>
                <meta name="description" content={product.description} />
            </Head>

            <Container className="my-4">
                <Row className="g-4">
                    <Col md={6}>
                        <img
                            src={product.image}
                            alt={product.name}
                            className="img-fluid rounded shadow-sm"
                            style={{
                                maxHeight: '500px',
                                objectFit: 'contain',
                                width: '100%'
                            }}
                        />
                    </Col>
                    <Col md={6}>
                        {/* Category */}
                        {product.category && (
                            <Badge bg="secondary" className="mb-2">
                                {product.category}
                            </Badge>
                        )}

                        <h1 className="mb-3">{product.name}</h1>

                        {/* Rating */}
                        {product.rating && (
                            <div className="mb-3">
                                <Badge bg="warning" text="dark">
                                    {product.rating.rate} ({product.rating.count} reviews)
                                </Badge>
                            </div>
                        )}

                        <p className="h2 text-primary mb-3">${product.price.toFixed(2)}</p>

                        <p className={`mb-4 ${product.availability ? 'text-success' : 'text-danger'}`}>
                            <strong>{product.availability ? ' In Stock' : '❌ Out of Stock'}</strong>
                        </p>

                        <div className="mb-4">
                            <h5>Description</h5>
                            <p className="lead">{product.description}</p>
                        </div>

                        <Button
                            onClick={handleAddToCart}
                            disabled={!product.availability}
                            variant="primary"
                            size="lg"
                            className="w-100 py-3"
                        >
                            {product.availability ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}