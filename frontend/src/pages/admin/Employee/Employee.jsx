import React, { useEffect, useState } from 'react';
import api from '../../../api/axiosInstance.js';
import { Button, Table, Modal, Form } from 'react-bootstrap';

function AdminEmployees() {
    const [employees, setEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', department: '' });
    const [editId, setEditId] = useState(null);

    const fetchEmployees = () => {
        api.get('/employee')
            .then(res => setEmployees(res.data.allEmployee))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/employee/${id}`);
            fetchEmployees();
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const handleEdit = async (emp) => {
        try {
            const res = await api.get(`/employee/${emp.id}`);
            const data = res.data;
            setFormData({
                name: data.name || '',
                department: data.department || ''
            });
            setEditId(emp.id);
            setShowModal(true);
        } catch (err) {
            console.error('Fetch employee error:', err);
        }
    };

    const handleAdd = () => {
        setFormData({ name: '', department: '' });
        setEditId(null);
        setShowModal(true);
    };

    const handleSubmit = async () => {
        try {
            if (editId) {
                await api.patch(`/employee/${editId}`, formData);
            } else {
                await api.post('/employee', formData);
            }
            setShowModal(false);
            fetchEmployees();
        } catch (err) {
            console.error('Submit error:', err);
        }
    };

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Manage Employees</h3>
                <Button variant="primary" onClick={handleAdd}>Add Employee</Button>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Api Key</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(emp => (
                        <tr key={emp.id}>
                            <td>{emp.name}</td>
                            <td>{emp.department || '—'}</td>
                            <td>{emp.apiKey || '—'}</td>
                            <td>
                                <Button variant="success" size="sm" className="me-2" onClick={() => handleEdit(emp)}>Edit</Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(emp.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal for Add/Edit Employee */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editId ? 'Edit Employee' : 'Add Employee'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Department</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        {editId ? 'Update' : 'Create'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AdminEmployees;
