import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

const AppNavbar = () => {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user'));
    const role = localStorage.getItem('role');

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold text-info">
                    Staff Manager
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav className="ms-auto align-items-center">
                        {user && (
                            <>
                                <span className="text-light me-3 small">
                                    {user.name} <span className="badge bg-secondary">{role}</span>
                                </span>
                                <Button variant="outline-light" size="sm" onClick={logout}>
                                    Logout
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
