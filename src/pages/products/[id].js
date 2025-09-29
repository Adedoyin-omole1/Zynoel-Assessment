import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { fetchProducts } from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import { Container, Row, Col, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import Layout from '../../components/Layout';
import Head from 'next/head';


export async function getServerSideProps(context) {
    const { id } = context.params;

    try {
        const response = await fetch(`https://fake-store-api.mock.beeceptor.com/api/products/${id}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const product = await response.json();

        return {
            props: {
                product,
            },
        };
    } catch (error) {
        return {
            props: {
                product: null,
                error: error.message
            },
        };
    }
}

export default function ProductDetailPage({ product, error }) {
    const router = useRouter();
    const dispatch = useDispatch();

    // Fallback client side fetch if ssr fails
    useEffect(() => {
        if (error && router.query.id) {
            // If ssr failed, trying to get from Redux store
            dispatch(fetchProducts());
        }
    }, [error, router.query.id, dispatch]);

    const handleAddToCart = () => {
        if (product) {
            dispatch(addToCart(product));
            toast.success('Added to cart!', {
                position: "top-right",
                autoClose: 2000
            });
        }
    };

    if (router.isFallback) {
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

    if (error || !product) {
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

                        <p className="h2 text-primary mb-3">${product.price?.toFixed(2) || '0.00'}</p>

                        <p className={`mb-4 ${product.availability ? 'text-success' : 'text-danger'}`}>
                            <strong>{product.availability ? ' In Stock' : ' Out of Stock'}</strong>
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