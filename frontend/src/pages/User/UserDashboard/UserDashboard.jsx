import React, { useEffect, useState } from "react";
import { Spinner, Card, Badge, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axiosInstance.js";

function UserDashboard() {
    const [userData, setUserData] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await api.get(`/employee/user/${userId}`);
                setUserData(userRes.data);

                const taskRes = await api.get(`/task`);
                const assignedTasks = taskRes.data.tasks.filter(
                    (task) => task.aSignTo?.toString() === userId
                );
                setTasks(assignedTasks);

                const reportRes = await api.get(`/report/my`);
                setReports(reportRes.data || []);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchData();
    }, [userId]);

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading profile...</p>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="container py-5 text-center">
                <p className="text-danger">User not found</p>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <Card className="mb-4 shadow-sm text-center">
                <Card.Body>
                    <h3 className="fw-bold">{userData.name}</h3>
                    <p className="text-muted mb-1">{userData.email}</p>
                    <Badge bg="info">{userData.role}</Badge>
                </Card.Body>
            </Card>

            <Row>
                <Col md={6}>
                    <Card
                        className="shadow-sm text-center clickable-card"
                        onClick={() => navigate("/employee/tasks")}
                        style={{ cursor: "pointer" }}
                    >
                        <Card.Body>
                            <h4>📌 My Tasks</h4>
                            <p className="display-6 fw-bold">{tasks.length}</p>
                            <p className="text-muted">View your assigned tasks</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card
                        className="shadow-sm text-center clickable-card"
                        onClick={() => navigate("/employee/reports")}
                        style={{ cursor: "pointer" }}
                    >
                        <Card.Body>
                            <h4>📝 My Reports</h4>
                            <p className="display-6 fw-bold">{reports.length}</p>
                            <p className="text-muted">View your submitted reports</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <div className="text-center mt-5">
                <p className="text-muted small">Logged in as <strong>{userData.role}</strong></p>
                <Button
                    variant="outline-secondary"
                    size="sm"
                    className="mt-2"
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </div>
        </div>
    );
}

export default UserDashboard;
