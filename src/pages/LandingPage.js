import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaBook, FaUsers, FaChartLine } from 'react-icons/fa';

const LandingPage = () => {
    return (
        <div>
            {/* Hero Section */}
            <div className="bg-primary text-white py-5">
                <Container>
                    <Row className="align-items-center">
                        <Col md={6}>
                            <h1 className="display-4 fw-bold mb-4">Welcome to EduSync</h1>
                            <p className="lead mb-4">
                                Your comprehensive learning management system for modern education.
                                Join us to experience seamless learning and teaching.
                            </p>
                            <div className="d-flex gap-3">
                                <Button
                                    as={Link}
                                    to="/login"
                                    variant="light"
                                    size="lg"
                                >
                                    Login
                                </Button>
                                <Button
                                    as={Link}
                                    to="/register"
                                    variant="outline-light"
                                    size="lg"
                                >
                                    Register
                                </Button>
                            </div>
                        </Col>
                        <Col md={6} className="d-none d-md-block">
                            <img
                                src="/education-illustration.svg"
                                alt="Education"
                                className="img-fluid"
                            />
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Features Section */}
            <Container className="py-5">
                <h2 className="text-center mb-5">Key Features</h2>
                <Row>
                    <Col md={3} className="mb-4">
                        <Card className="h-100 text-center">
                            <Card.Body>
                                <FaGraduationCap size={48} className="text-primary mb-3" />
                                <Card.Title>Interactive Learning</Card.Title>
                                <Card.Text>
                                    Engage with course materials through interactive content and assessments.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} className="mb-4">
                        <Card className="h-100 text-center">
                            <Card.Body>
                                <FaBook size={48} className="text-primary mb-3" />
                                <Card.Title>Course Management</Card.Title>
                                <Card.Text>
                                    Create, manage, and track courses with ease.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} className="mb-4">
                        <Card className="h-100 text-center">
                            <Card.Body>
                                <FaUsers size={48} className="text-primary mb-3" />
                                <Card.Title>Student Progress</Card.Title>
                                <Card.Text>
                                    Monitor student performance and provide timely feedback.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} className="mb-4">
                        <Card className="h-100 text-center">
                            <Card.Body>
                                <FaChartLine size={48} className="text-primary mb-3" />
                                <Card.Title>Analytics</Card.Title>
                                <Card.Text>
                                    Get detailed insights into learning outcomes and performance.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Call to Action */}
            <div className="bg-light py-5">
                <Container className="text-center">
                    <h2 className="mb-4">Ready to Get Started?</h2>
                    <p className="lead mb-4">
                        Join our community of learners and educators today.
                    </p>
                    <Button
                        as={Link}
                        to="/register"
                        variant="primary"
                        size="lg"
                    >
                        Sign Up Now
                    </Button>
                </Container>
            </div>
        </div>
    );
};

export default LandingPage; 