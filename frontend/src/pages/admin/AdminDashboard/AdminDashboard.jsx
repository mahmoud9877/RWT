import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css'; // تأكد إنك مركّب bootstrap-icons
import './AdminDashboard.css'; // لو حابب تضيف ستايل خارجي

function AdminDashboard() {
    const navigate = useNavigate(); // ✅ لازم يكون هنا
    const handleLogout = () => {
        localStorage.clear(); // يمسح التوكن وكل البيانات
        navigate('/login');   // يوجه لصفحة تسجيل الدخول
    };
    return (
        <Container className="py-5">
            <div className="text-center mb-5">
                <h2 className="fw-bold text-primary">🛠️ Admin Control Panel</h2>
                <p className="text-muted">Manage everything from one place</p>
            </div>

            <Row xs={1} md={3} className="g-4">
                <Col>
                    <Card className="shadow-sm border-0 bg-light h-100">
                        <Card.Body className="text-center">
                            <i className="bi bi-people-fill display-5 text-info mb-3"></i>
                            <Card.Title className="fw-bold">Manage Employees</Card.Title>
                            <Card.Text className="text-muted">Add, edit, or remove staff members.</Card.Text>
                            <Link to="/admin/employees" className="btn btn-outline-info">Go to Employees</Link>
                        </Card.Body>
                    </Card>
                </Col>

                <Col>
                    <Card className="shadow-sm border-0 bg-light h-100">
                        <Card.Body className="text-center">
                            <i className="bi bi-list-task display-5 text-warning mb-3"></i>
                            <Card.Title className="fw-bold">Manage Tasks</Card.Title>
                            <Card.Text className="text-muted">Assign and track employee tasks.</Card.Text>
                            <Link to="/admin/tasks" className="btn btn-outline-warning">Go to Tasks</Link>
                        </Card.Body>
                    </Card>
                </Col>

                <Col>
                    <Card className="shadow-sm border-0 bg-light h-100">
                        <Card.Body className="text-center">
                            <i className="bi bi-file-earmark-text display-5 text-success mb-3"></i>
                            <Card.Title className="fw-bold">Review Reports</Card.Title>
                            <Card.Text className="text-muted">View and summarize employee reports.</Card.Text>
                            <Link to="/admin/reports" className="btn btn-outline-success">Go to Reports</Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <div className="text-center mt-5">
                <p className="text-muted small">Logged in as <strong>Admin</strong></p>
                <Button
                    variant="outline-secondary"
                    size="sm"
                    className="mt-2"
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </div>
        </Container>
    );
}

export default AdminDashboard;
