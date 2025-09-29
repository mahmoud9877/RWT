import React, { useEffect, useState } from "react";
import { Spinner, Card, Button, Form, Badge } from "react-bootstrap";
import api from "../../../api/axiosInstance.js";
import Joi from "joi";

function MyReports() {
    const [reports, setReports] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        task_id: "",
        text: "",
        file: null,
    });

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [reportRes, taskRes] = await Promise.all([api.get("/report/my"), api.get("/task")]);
                setReports(reportRes.data || []);

                const myTasks = taskRes.data.tasks.filter((task) => task.aSignTo?.toString() === userId);
                setTasks(myTasks);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, file: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Joi schema
        const schema = Joi.object({
            task_id: Joi.string().required().messages({ "any.required": "Task is required" }),
            text: Joi.string().min(10).required().messages({ "any.required": "Report text is required", "string.min": "Report text is too short" }),
            file: Joi.any()
                .custom((file, helpers) => {
                    if (file) {
                        const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
                        if (!allowedTypes.includes(file.type)) {
                            return helpers.error("any.invalid");
                        }
                    }
                    return file;
                }, "File validation")
                .messages({ "any.invalid": "Only PDF or Word files are allowed" }),
        });

        const { error } = schema.validate(formData);
        if (error) {
            alert(`❌ Validation error: ${error.message}`);
            return;
        }

        try {
            const payload = new FormData();
            payload.append("employee_id", userId);
            payload.append("task_id", formData.task_id);
            payload.append("text", formData.text);
            if (formData.file) payload.append("file", formData.file);

            const res = await api.post("/report", payload, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setReports((prev) => [res.data.report, ...prev]);
            setShowForm(false);
            setFormData({ task_id: "", text: "", file: null });
            alert("Report submitted successfully!");
        } catch (error) {
            console.error("Error creating report:", error);
            alert("❌ Failed to submit report.");
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading your reports...</p>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-primary">📑 My Reports</h3>
                <Button variant="outline-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Cancel" : "➕ New Report"}
                </Button>
            </div>

            {showForm && (
                <Card className="mb-4 shadow-sm">
                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Select Task</Form.Label>
                                <Form.Select name="task_id" value={formData.task_id} onChange={handleChange} required>
                                    <option value="">-- Choose Task --</option>
                                    {tasks.map((task) => (
                                        <option key={task.id} value={task.id}>
                                            {task.title}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Report Text</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    name="text"
                                    value={formData.text}
                                    onChange={handleChange}
                                    placeholder="Write your report here..."
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Upload File (optional)</Form.Label>
                                <Form.Control type="file" name="file" accept=".pdf,.docx" onChange={handleChange} />
                            </Form.Group>

                            <Button type="submit" variant="success">
                                Submit Report
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            )}

            {reports.length > 0 ? (
                reports.map((report) => (
                    <Card key={report.id} className="mb-3 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5 className="mb-0">{report.task?.title || "Untitled Task"}</h5>
                                <Badge bg={report.summary ? "success" : "secondary"}>
                                    {report.summary ? "Summarized" : "Pending"}
                                </Badge>
                            </div>

                            {report.summary ? (
                                <div className="mb-2">
                                    <p className="fw-bold small text-success mb-1">🤖 AI Summary:</p>
                                    <ul className="ps-3 mb-0 small">
                                        {report.summary.split("\n").map((line, index) => (
                                            <li key={index}>{line}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <span className="text-muted">No summary available</span>
                            )}

                            {report.file ? (
                                <a
                                    href={`http://localhost:5000/uploads/${report.file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="d-block mt-2 text-decoration-none text-primary"
                                >
                                    📎 {report.file}
                                </a>
                            ) : (
                                <span className="text-muted">No file uploaded</span>
                            )}

                            <small className="text-muted d-block mt-2">
                                Submitted: {new Date(report.createdAt).toLocaleString()}
                            </small>
                        </Card.Body>
                    </Card>
                ))
            ) : (
                <p className="text-muted">You haven’t submitted any reports yet.</p>
            )}
        </div>
    );
}

export default MyReports;
