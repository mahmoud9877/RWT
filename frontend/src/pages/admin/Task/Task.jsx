import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import api from '../../../api/axiosInstance.js';

function AssignTask({ onClose }) {
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        status: 'pending',
        aSignTo: ''
    });
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/employee')
            .then(res => {
                setEmployees(res.data.allEmployee || []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching employees:', err);
                setLoading(false);
            });
    }, []);

    const handleTaskSubmit = async () => {
        try {
            await api.post('/task', taskData);
            alert('Task assigned successfully!');
            onClose();
        } catch (err) {
            console.error('Task assign error:', err);
        }
    };

    return (
        <Alert variant="secondary" className="mt-4">
            <h5>Assign Task</h5>
            {loading ? (
                <div className="text-center py-3">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Form>
                    <Form.Group className="mb-2">
                        <Form.Label>Assign To</Form.Label>
                        <Form.Select
                            value={taskData.aSignTo}
                            onChange={(e) => setTaskData({ ...taskData, aSignTo: e.target.value })}
                        >
                            <option value="">Select Employee</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name} ({emp.department})
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={taskData.title}
                            onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={taskData.description}
                            onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            value={taskData.status}
                            onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
                        >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </Form.Select>
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                        <Button variant="secondary" className="me-2" onClick={onClose}>Cancel</Button>
                        <Button variant="primary" onClick={handleTaskSubmit}>Assign</Button>
                    </div>
                </Form>
            )}
        </Alert>
    );
}

export default AssignTask;
