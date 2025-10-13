import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { fetchProducts, setSearchQuery } from '../../redux/slices/productSlice';
import ProductCard from '../../components/ProductCard';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import Layout from '../../components/Layout';

export default function ProductsPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { search } = router.query;
    const { items, status, error } = useSelector(state => state.products);

    useEffect(() => {
        // Set search query from URL if present
        if (search) {
            dispatch(setSearchQuery(search));
        }
    }, [search, dispatch]);

    useEffect(() => {
        if (status === 'idle' || search) {
            dispatch(fetchProducts());
        }
    }, [status, dispatch, search]);

    // Filter products based on search query
    const filteredProducts = search
        ? items.filter(product =>
            product.name?.toLowerCase().includes(search.toLowerCase()) ||
            product.description?.toLowerCase().includes(search.toLowerCase()) ||
            product.category?.toLowerCase().includes(search.toLowerCase())
        )
        : items;

    if (status === 'loading') {
        return (
            <Layout pageTitle="Products">
                <Container className="text-center py-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="mt-2">Loading products...</p>
                </Container>
            </Layout>
        );
    }

    if (status === 'failed') {
        return (
            <Layout pageTitle="Products">
                <Container className="py-4">
                    <Alert variant="danger">
                        <Alert.Heading>Error loading products</Alert.Heading>
                        <p>{error}</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => dispatch(fetchProducts())}
                        >
                            Try Again
                        </button>
                    </Alert>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout pageTitle={search ? `Search: ${search}` : "All Products"}>
            <Container className="my-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="mb-0">
                        {search ? `Search Results for "${search}"` : 'Our Products'}
                    </h1>
                    {search && (
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => {
                                router.push('/products');
                                dispatch(setSearchQuery(''));
                            }}
                        >
                            Clear Search
                        </button>
                    )}
                </div>

                {filteredProducts.length === 0 ? (
                    <Alert variant="info" className="text-center">
                        <Alert.Heading>
                            {search ? 'No products found' : 'No products available'}
                        </Alert.Heading>
                        <p>
                            {search
                                ? `No products match your search for "${search}"`
                                : 'Please check back later for new products.'
                            }
                        </p>
                        {search && (
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    router.push('/products');
                                    dispatch(setSearchQuery(''));
                                }}
                            >
                                View All Products
                            </button>
                        )}
                    </Alert>
                ) : (
                    <>
                        <p className="text-muted mb-4">
                            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                            {search && ` for "${search}"`}
                        </p>
                        <Row className="g-4">
                            {filteredProducts.map(product => (
                                <Col key={product.id} sm={6} md={4} lg={3}>
                                    <ProductCard product={product} />
                                </Col>
                            ))}
                        </Row>
                    </>
                )}
            </Container>
        </Layout>
    );
}