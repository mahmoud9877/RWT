import React, { useEffect, useState } from "react";
import { Spinner, Card, Badge } from "react-bootstrap";
import api from "../../../api/axiosInstance.js";

function MyTasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await api.get("/task");
                const assigned = res.data.tasks.filter(
                    (task) => task.aSignTo?.toString() === userId
                );
                setTasks(assigned);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchTasks();
    }, [userId]);

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading your tasks...</p>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h3 className="fw-bold text-primary mb-4">📌 My Assigned Tasks</h3>

            {tasks.length > 0 ? (
                tasks.map((task) => (
                    <Card key={task.id} className="mb-3 shadow-sm border-0">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5 className="mb-0">{task.title}</h5>
                                <Badge
                                    bg={
                                        task.status === "done"
                                            ? "success"
                                            : task.status === "in_progress"
                                            ? "warning"
                                            : "secondary"
                                    }
                                >
                                    {task.status.replace("_", " ")}
                                </Badge>
                            </div>

                            <p className="text-muted mb-2">{task.description}</p>

                            <small className="text-muted">
                                Assigned: {new Date(task.createdAt).toLocaleDateString()}
                            </small>
                        </Card.Body>
                    </Card>
                ))
            ) : (
                <p className="text-muted">You don’t have any tasks assigned yet.</p>
            )}
        </div>
    );
}

export default MyTasks;
