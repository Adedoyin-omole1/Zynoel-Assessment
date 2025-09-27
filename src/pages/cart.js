import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Button, Alert, Table } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { removeFromCart, updateQuantity } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';

export default function CartPage() {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.items);
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const handleRemoveItem = (itemId) => {
        dispatch(removeFromCart(itemId));
        toast.success('Item removed from cart');
    };

    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    };

    if (cartItems.length === 0) {
        return (
            <Layout pageTitle="Cart">
                <Container className="py-5">
                    <Alert variant="info" className="text-center">
                        <Alert.Heading>Your cart is empty</Alert.Heading>
                        <p>Start shopping to add items to your cart.</p>
                        <Link href="/products" className="btn btn-primary">
                            Continue Shopping
                        </Link>
                    </Alert>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout pageTitle="Shopping Cart">
            <Container className="py-4">
                <h1 className="mb-4">Shopping Cart</h1>

                {/*for big screens */}
                <div className="d-none d-md-block">
                    <Table responsive striped bordered hover>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                    className="rounded"
                                                />
                                            </div>
                                            <span className="ms-3">{item.name}</span>
                                        </div>
                                    </td>
                                    <td className="align-middle">${item.price.toFixed(2)}</td>
                                    <td className="align-middle">
                                        <div className="d-flex align-items-center">
                                            <Button
                                                size="sm"
                                                variant="outline-secondary"
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </Button>
                                            <span className="mx-3">{item.quantity}</span>
                                            <Button
                                                size="sm"
                                                variant="outline-secondary"
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </td>
                                    <td className="align-middle">${(item.price * item.quantity).toFixed(2)}</td>
                                    <td className="align-middle">
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleRemoveItem(item.id)}
                                        >
                                            Remove
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>

                {/*for mobile screens */}
                <div className="d-md-none">
                    {cartItems.map(item => (
                        <Card key={item.id} className="mb-3">
                            <Card.Body>
                                <Row className="align-items-center">
                                    <Col xs={4}>
                                        <div style={{ position: 'relative', width: '100%', height: '80px' }}>
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                className="rounded"
                                            />
                                        </div>
                                    </Col>
                                    <Col xs={8}>
                                        <h6 className="mb-1">{item.name}</h6>
                                        <p className="mb-1">${item.price.toFixed(2)}</p>
                                        <div className="d-flex align-items-center mb-2">
                                            <Button
                                                size="sm"
                                                variant="outline-secondary"
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </Button>
                                            <span className="mx-2">{item.quantity}</span>
                                            <Button
                                                size="sm"
                                                variant="outline-secondary"
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </Button>
                                        </div>
                                        <p className="mb-1 fw-bold">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleRemoveItem(item.id)}
                                        >
                                            Remove
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}
                </div>

                {/* Cart Summay */}
                <Card className="mt-4">
                    <Card.Body>
                        <Row className="align-items-center">
                            <Col md={6}>
                                <h4 className="mb-2">Cart Summary</h4>
                                <p className="mb-1">Total Items: <strong>{totalQuantity}</strong></p>
                                <h5 className="mb-0">Total Amount: <strong>${totalAmount.toFixed(2)}</strong></h5>
                            </Col>
                            <Col md={6} className="text-md-end mt-3 mt-md-0">
                                <Link href="/products" className="btn btn-primary btn-lg me-2">
                                    Continue Shopping
                                </Link>
                                <Button variant="success" size="lg">
                                    Proceed to Checkout
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        </Layout>
    );
}