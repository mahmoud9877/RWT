import React from 'react';
import './Home.css'
import { Container, Row, Col, Button } from 'react-bootstrap';

function LandingPage() {
    return (
        <div className="landing-page bg-light min-vh-100 d-flex flex-column justify-content-center">
            <Container>
                <Row className="align-items-center">
                    <Col md={6} className="text-center text-md-start mb-4 mb-md-0">
                        <h1 className="display-4 fw-bold text-primary">Smart Staff Manager</h1>
                        <p className="lead text-muted">
                            A powerful platform for managing employees, tasks, and AI-powered reports.
                            Streamline your workflow, boost productivity, and stay in control—all in one place.
                        </p>
                        <Button variant="primary" size="lg" href="/login">
                            Get Started
                        </Button>
                    </Col>
                    <Col md={6}>
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png"
                            alt="Team Management"
                            className="img-fluid"
                        />
                    </Col>
                </Row>

                <Row className="mt-5">
                    <Col md={4} className="text-center">
                        <h5 className="fw-bold">Employee Management</h5>
                        <p className="text-muted">Add, edit, and track employees with ease.</p>
                    </Col>
                    <Col md={4} className="text-center">
                        <h5 className="fw-bold">Task Assignment</h5>
                        <p className="text-muted">Assign tasks and monitor progress in real time.</p>
                    </Col>
                    <Col md={4} className="text-center">
                        <h5 className="fw-bold">AI-Powered Reports</h5>
                        <p className="text-muted">Upload files and generate smart summaries instantly.</p>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default LandingPage;
