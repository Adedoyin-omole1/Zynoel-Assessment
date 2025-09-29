import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Link from 'next/link';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout pageTitle="Home">
      <Container className="my-5">
        {/* Hero Section */}
        <Row className="align-items-center py-5">
          <Col lg={6}>
            <h1 className="display-4 fw-bold mb-4">
              Welcome to Our E-commerce Store
            </h1>
            <p className="lead mb-4">
              Discover amazing products at great prices. Shop with confidence
              and enjoy fast delivery and excellent customer service.
            </p>
            <Link href="/products" className="btn btn-primary btn-lg">
              Shop Now
            </Link>
          </Col>
          <Col lg={6}>
            <div
              className="bg-light rounded shadow-sm"
              style={{
                height: '400px',
                backgroundImage: 'url("./image.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
          </Col>
        </Row>

        {/* Features Section */}
        <Row className="py-5">
          <Col md={4} className="mb-4">
            <Card className="h-100 text-center border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="text-primary mb-3">
                  <i className="bi bi-truck fs-1"></i>
                </div>
                <Card.Title>Fast Delivery</Card.Title>
                <Card.Text>
                  Get your products delivered quickly and safely to your doorstep.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 text-center border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="text-primary mb-3">
                  <i className="bi bi-shield-check fs-1"></i>
                </div>
                <Card.Title>Secure Payment</Card.Title>
                <Card.Text>
                  Your payments are safe and secure with our encrypted payment system.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 text-center border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="text-primary mb-3">
                  <i className="bi bi-headset fs-1"></i>
                </div>
                <Card.Title>24/7 Support</Card.Title>
                <Card.Text>
                  Our customer support team is always here to help you with any questions.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}