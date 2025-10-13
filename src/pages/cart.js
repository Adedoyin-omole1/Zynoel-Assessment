import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Container, Row, Col, Card, Button, Alert, Table } from 'react-bootstrap';
import Link from 'next/link';
import { removeFromCart, updateQuantity } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';

export default function CartPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.items || []);
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

    const handleRemoveItem = (itemId) => {
        dispatch(removeFromCart(itemId));
        toast.success('Item removed from cart');
    };

    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    };
    // show loading state until mounted
    if (!mounted) {
        return (
            <Layout pageTitle="Cart">
                <Container className="py-5">
                    <div className="text-center py-5">
                        <div className="mb-4">
                            <span style={{ fontSize: '4rem' }}>🛒</span>
                        </div>
                        <h2 className="mb-3">Your cart</h2>
                        <p className="text-muted mb-4">Loading cart…</p>
                        <Link href="/products" className="btn btn-primary btn-lg">
                            Continue Shopping
                        </Link>
                    </div>
                </Container>
            </Layout>
        );
    }

    // i render the real cart content hereafter
    if (cartItems.length === 0) {
        return (
            <Layout pageTitle="Cart">
                <Container className="py-5">
                    <div className="text-center py-5">
                        <div className="mb-4">
                            <span style={{ fontSize: '4rem' }}>🛒</span>
                        </div>
                        <h2 className="mb-3">Your cart is empty</h2>
                        <p className="text-muted mb-4">Start shopping to add items to your cart.</p>
                        <Link href="/products" className="btn btn-primary btn-lg">
                            Continue Shopping
                        </Link>
                    </div>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout pageTitle="Shopping Cart">
            <Container className="py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="mb-0">Shopping Cart</h1>
                    <span className="text-muted">{totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}</span>
                </div>

                {/* Desktop View */}
                <div className="d-none d-md-block">
                    <Card className="shadow-sm">
                        <Card.Body className="p-0">
                            <Table responsive className="mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="ps-4" style={{ width: '45%' }}>Product</th>
                                        <th className="text-center">Price</th>
                                        <th className="text-center">Quantity</th>
                                        <th className="text-center">Subtotal</th>
                                        <th className="text-center pe-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map(item => (
                                        <tr key={item.id} className="border-top">
                                            <td className="ps-4 py-3">
                                                <div className="d-flex align-items-center">
                                                    <div style={{ width: '80px', height: '80px' }} className="flex-shrink-0">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="rounded"
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                    <div className="ms-3">
                                                        <h6 className="mb-1 fw-bold">{item.name}</h6>
                                                        <small className="text-muted">{item.category}</small>
                                                        {item.description && (
                                                            <small className="text-muted d-block mt-1">
                                                                {item.description.length > 100
                                                                    ? `${item.description.substring(0, 100)}...`
                                                                    : item.description
                                                                }
                                                            </small>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-center align-middle">
                                                <span className="fw-bold text-primary">${item.price.toFixed(2)}</span>
                                            </td>
                                            <td className="text-center align-middle">
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <Button
                                                        size="sm"
                                                        variant="outline-secondary"
                                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        style={{ width: '40px' }}
                                                    >
                                                        -
                                                    </Button>
                                                    <span className="mx-3 fw-bold" style={{ minWidth: '30px' }}>{item.quantity}</span>
                                                    <Button
                                                        size="sm"
                                                        variant="outline-secondary"
                                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                        style={{ width: '40px' }}
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </td>
                                            <td className="text-center align-middle">
                                                <span className="fw-bold">${(item.price * item.quantity).toFixed(2)}</span>
                                            </td>
                                            <td className="text-center align-middle pe-4">
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="px-3"
                                                >
                                                    Remove
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </div>

                {/* Mobile View */}
                <div className="d-md-none">
                    {cartItems.map(item => (
                        <Card key={item.id} className="mb-3 shadow-sm">
                            <Card.Body>
                                <Row className="align-items-center">
                                    <Col xs={4}>
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="rounded"
                                            style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                                        />
                                    </Col>
                                    <Col xs={8}>
                                        <h6 className="fw-bold mb-1">{item.name}</h6>
                                        <small className="text-muted d-block mb-2">{item.category}</small>
                                        {item.description && (
                                            <small className="text-muted d-block mb-2">
                                                {item.description.length > 80
                                                    ? `${item.description.substring(0, 80)}...`
                                                    : item.description
                                                }
                                            </small>
                                        )}
                                        <p className="h5 text-primary mb-2">${item.price.toFixed(2)}</p>

                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <div className="d-flex align-items-center">
                                                <Button
                                                    size="sm"
                                                    variant="outline-secondary"
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    style={{ width: '35px' }}
                                                >
                                                    -
                                                </Button>
                                                <span className="mx-3 fw-bold">{item.quantity}</span>
                                                <Button
                                                    size="sm"
                                                    variant="outline-secondary"
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                    style={{ width: '35px' }}
                                                >
                                                    +
                                                </Button>
                                            </div>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleRemoveItem(item.id)}
                                            >
                                                Remove
                                            </Button>
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center border-top pt-2">
                                            <span className="text-muted">Subtotal:</span>
                                            <span className="fw-bold h6 mb-0">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}
                </div>

                {/* Cart Summary */}
                <Row className="mt-4">
                    <Col lg={8} className="mb-3">
                        <Card className="bg-light border-0">
                            <Card.Body>
                                <h6 className="fw-bold mb-3">🛒 Continue Shopping</h6>
                                <p className="text-muted mb-3">Find more amazing products to add to your cart.</p>
                                <Link href="/products" className="btn btn-outline-primary">
                                    Browse Products
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={4}>
                        <Card className="shadow-sm border-0">
                            <Card.Body>
                                <h5 className="fw-bold mb-3">Order Summary</h5>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Items ({totalQuantity}):</span>
                                    <span>${totalAmount.toFixed(2)}</span>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Shipping:</span>
                                    <span className="text-success">FREE</span>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Tax:</span>
                                    <span>Calculated at checkout</span>
                                </div>

                                <hr />

                                <div className="d-flex justify-content-between mb-4">
                                    <strong>Total Amount:</strong>
                                    <strong className="h5 text-primary">${totalAmount.toFixed(2)}</strong>
                                </div>

                                <div className="d-grid gap-2">
                                    <Button variant="success" size="lg" className="fw-bold py-3">
                                        <i className="bi bi-bag-fill"></i> Proceed to Checkout
                                    </Button>
                                    <Link href="/products" className="btn btn-outline-secondary">
                                        Continue Shopping
                                    </Link>
                                </div>

                                <div className="mt-3 text-center">
                                    <small className="text-muted">
                                        <i className="bi bi-shield-lock"></i> Secure checkout · 30-day returns · Free shipping
                                    </small>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
