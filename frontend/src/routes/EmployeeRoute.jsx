import React from 'react';
import { Navigate } from 'react-router-dom';

function EmployeeRoute({ children }) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'employee') {
        return <Navigate to="/login" />;
    }

    return children;
}

export default EmployeeRoute;
