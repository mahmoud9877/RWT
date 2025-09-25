import React, { useEffect, useState } from 'react';
import api from '../../../api/axiosInstance.js';
import { Container, Spinner, Card, Row, Col, Badge, Button } from 'react-bootstrap';
import './Report.css'; // لو حابب تضيف تأثيرات CSS إضافية

function AllReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/report')
            .then(res => {
                const reportsData = Array.isArray(res.data) ? res.data : [];

                const allReports = reportsData.map(report => ({
                    id: report.id,
                    file: report.file,
                    createdAt: report.createdAt,
                    taskTitle: report.task?.title,
                    assigneeName: report.employee?.name,
                    department: report.employee?.department,
                }));

                setReports(allReports);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching reports:', err);
                setReports([]);
                setLoading(false);
            });
    }, []);

    return (
        <Container className="py-4">
            <div className="mb-4 text-center">
                <h2 className="fw-bold text-primary">📄 Submitted Reports</h2>
                <p className="text-muted">Review all reports submitted by employees</p>
                <p className="text-muted">Total reports: <strong>{reports.length}</strong></p>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2 text-muted">Loading reports...</p>
                </div>
            ) : reports.length > 0 ? (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {reports.map(report => (
                        <Col key={report.id}>
                            <Card className="shadow-sm h-100 report-card">
                                <Card.Body>
                                    <Card.Title className="mb-2">
                                        <span className="fw-bold text-dark">
                                            {report.taskTitle || 'Untitled Task'}
                                        </span>
                                    </Card.Title>

                                    <Card.Subtitle className="mb-2 text-muted">
                                        Submitted by{' '}
                                        <Badge bg="secondary">
                                            {report.assigneeName || 'Unknown'}
                                        </Badge>{' '}
                                        {report.department && (
                                            <span className="text-muted small">({report.department})</span>
                                        )}
                                    </Card.Subtitle>

                                    <Card.Text className="mb-3">
                                        <strong>File:</strong>{' '}
                                        {report.file ? (
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                href={`http://localhost:5000/uploads/${report.file}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                📎 View File
                                            </Button>
                                        ) : (
                                            <span className="text-muted">No file uploaded</span>
                                        )}
                                    </Card.Text>

                                    <Card.Text className="text-muted small">
                                        <strong>Submitted:</strong>{' '}
                                        {new Date(report.createdAt).toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <p className="text-muted text-center">No reports have been submitted yet.</p>
            )}
        </Container>
    );
}

export default AllReports;
