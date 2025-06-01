import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NavigationBar = () => {
    const { isAuthenticated, userRole, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand as={Link} to="/">EduSync</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {isAuthenticated ? (
                            <>
                                {userRole === 'Student' ? (
                                    <>
                                        <Nav.Link as={Link} to="/student/dashboard">Dashboard</Nav.Link>
                                        <Nav.Link as={Link} to="/student/courses">My Courses</Nav.Link>
                                        <Nav.Link as={Link} to="/student/assessments">Assessments</Nav.Link>
                                        <Nav.Link as={Link} to="/student/results">Results</Nav.Link>
                                    </>
                                ) : (
                                    <>
                                        <Nav.Link as={Link} to="/instructor/dashboard">Dashboard</Nav.Link>
                                        <Nav.Link as={Link} to="/instructor/courses">Manage Courses</Nav.Link>
                                        <Nav.Link as={Link} to="/instructor/analytics">Analytics</Nav.Link>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                    {isAuthenticated && (
                        <Button variant="outline-light" onClick={handleLogout}>
                            Logout
                        </Button>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar; 