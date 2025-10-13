import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import { Container, Row, Col, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import Layout from '../../components/Layout';
import Head from 'next/head';
import { useRouter } from 'next/router';

export async function getServerSideProps(context) {
    const { id } = context.params;
    const singleUrl = `https://fake-store-api.mock.beeceptor.com/api/products/${id}`;
    const listUrl = `https://fake-store-api.mock.beeceptor.com/api/products`;

    try {
        const res = await fetch(singleUrl);
        console.log(`[product detail] GET ${singleUrl} -> ${res.status}`);

        if (!res.ok) {
            // if single endpoint returns non-ok, fall back to list endpoint
            console.log(`[product detail] single endpoint returned ${res.status}, trying list endpoint`);
            const listRes = await fetch(listUrl);
            console.log(`[product detail] GET ${listUrl} -> ${listRes.status}`);

            if (!listRes.ok) {
                return { props: { product: null, error: `Failed to fetch product (single:${res.status}, list:${listRes.status})` } };
            }

            const data = await listRes.json();
            const found = (Array.isArray(data) ? data : []).find(p => String(p.product_id ?? p.id) === String(id));

            if (!found) {
                return { props: { product: null, error: `Product with id ${id} not found` } };
            }

            const product = normalizeProduct(found, id);
            return { props: { product } };
        }

        // res.ok === true
        const raw = await res.json();
        console.log('[product detail] single product raw:', raw);

        if (Array.isArray(raw)) {
            const found = raw.find(p => String(p.product_id ?? p.id) === String(id));
            if (!found) {
                // fallback: try list endpoint too (redundant but safe)
                const listRes = await fetch(listUrl);
                const data = listRes.ok ? await listRes.json() : [];
                const foundAgain = (Array.isArray(data) ? data : []).find(p => String(p.product_id ?? p.id) === String(id));
                if (!foundAgain) {
                    return { props: { product: null, error: `Product with id ${id} not found in returned array` } };
                }
                return { props: { product: normalizeProduct(foundAgain, id) } };
            }
            return { props: { product: normalizeProduct(found, id) } };
        }

        // raw is a single object
        return { props: { product: normalizeProduct(raw, id) } };
    } catch (err) {
        console.error('Error in getServerSideProps for product detail:', err);
        return { props: { product: null, error: err.message } };
    }
}

// Normalize product data to ensure consistent fields
function normalizeProduct(raw = {}, fallbackId) {
    const id = raw.id ?? raw.product_id ?? raw.productId ?? fallbackId ?? null;
    const name = raw.name ?? raw.title ?? raw.product_name ?? 'Unnamed Product';
    const image = raw.image ?? raw.thumbnail ?? raw.image_url ?? raw.imageUrl ?? null;
    const price = Number(raw.price ?? raw.cost ?? raw.price_usd ?? 0) || 0;
    const description = raw.description ?? raw.body ?? raw.long_description ?? '';
    const availability = raw.availability !== false && raw.availability !== 'out of stock';
    const category = raw.category ?? raw.type ?? null;
    const rating = raw.rating ?? raw.ratings ?? raw.rating_info ?? null;

    return {
        ...raw,
        id,
        name,
        image,
        price,
        description,
        availability,
        category,
        rating
    };
}

export default function ProductDetailPage({ product, error }) {
    const router = useRouter();
    const dispatch = useDispatch();

    if (router.isFallback) {
        return (
            <Layout pageTitle="Loading...">
                <Container className="text-center py-5">
                    <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>
                </Container>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout pageTitle="Product Error">
                <Container className="py-4">
                    <Alert variant="danger">
                        <Alert.Heading>Unable to load product</Alert.Heading>
                        <p>{error}</p>
                        <Button variant="primary" onClick={() => router.push('/products')}>Return to Products</Button>
                    </Alert>
                </Container>
            </Layout>
        );
    }

    if (!product) {
        return (
            <Layout pageTitle="Product Not Found">
                <Container className="py-4">
                    <Alert variant="warning">
                        <Alert.Heading>Product Not Found</Alert.Heading>
                        <p>The product you're looking for doesn't exist or could not be loaded.</p>
                        <Button variant="primary" onClick={() => router.push('/products')}>Return to Products</Button>
                    </Alert>
                </Container>
            </Layout>
        );
    }

    const normalizedId = product.id;
    const isAvailable = product.availability !== false && product.availability !== 'out of stock';

    const handleAddToCart = () => {
        const payload = { ...product, id: normalizedId };
        dispatch(addToCart(payload));
        toast.success('Added to cart!', { position: "top-right", autoClose: 1500 });
    };

    return (
        <Layout pageTitle={product.name || 'Product Details'}>
            <Head><meta name="description" content={product.description || ''} /></Head>

            <Container className="my-4">
                <Row className="g-4">
                    <Col md={6}>
                        <div className="position-relative bg-light rounded p-4 d-flex align-items-center justify-content-center" style={{ minHeight: '320px' }}>
                            {product.image ? (
                                <img src={product.image} alt={product.name} className="img-fluid rounded" style={{ maxHeight: '500px', objectFit: 'contain', width: '100%' }} />
                            ) : (
                                <div style={{ height: '300px', width: '100%', background: '#f5f5f5' }} />
                            )}
                        </div>
                    </Col>

                    <Col md={6}>
                        <div className="product-info">
                            {product.category && <Badge bg="light" text="dark" className="mb-3 px-3 py-2 border">{product.category}</Badge>}

                            <h1 className="mb-3 fw-bold text-dark">{product.name}</h1>

                            {product.rating && (
                                <div className="mb-4 d-flex align-items-center">
                                    <div className="bg-warning text-dark px-2 py-1 rounded me-2"><strong> <i className="bi bi-star-fill"></i> {product.rating}</strong></div>
                                    <span className="text-muted">({product.reviews?.length ?? 0} reviews)</span>
                                </div>
                            )}

                            <div className="price-section mb-4">
                                <p className="h1 text-primary fw-bold mb-2">${Number(product.price || 0).toFixed(2)}</p>
                                <div className={`d-flex align-items-center ${isAvailable ? 'text-success' : 'text-danger'}`}>
                                    <span className={`badge ${isAvailable ? 'bg-success' : 'bg-danger'} me-2`}>{isAvailable ? '✓' : '✗'}</span>
                                    <strong>{isAvailable ? 'In Stock' : 'Out of Stock'}</strong>
                                </div>
                            </div>

                            <div className="action-buttons mb-4">
                                <Button onClick={handleAddToCart} disabled={!isAvailable} variant={isAvailable ? "primary" : "secondary"} size="lg" className="w-100 py-3 fw-bold mb-3">
                                    {isAvailable ? '🛒 Add to Cart' : 'Currently Unavailable'}
                                </Button>

                                <Button variant="outline-dark" size="lg" className="w-100 py-3" onClick={() => router.push('/products')}>
                                    ← Back to Products
                                </Button>
                            </div>

                            <div className="product-description mb-4">
                                <h5 className="fw-bold mb-3">Product Description</h5>
                                <p className="text-muted lh-lg">{product.description || "No description available for this product."}</p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
