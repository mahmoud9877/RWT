import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './Login.css';

function Login() {
    const [apiKey, setApiKey] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}auth/login`,
                { apiKey }
            );
            const token = res.data.token;
            console.log("login data",res)
            localStorage.setItem('token', token);

            const decoded = jwtDecode(token); // { id, role }
            localStorage.setItem('role', decoded.role);
            localStorage.setItem('userId', decoded.id);
            localStorage.setItem('apiKey', decoded.apiKey);

            if (decoded.role === 'admin') {
                navigate('/admin');
            } else if (decoded.role === 'employee') {
                navigate('/employee'); // أو أي صفحة خاصة بالموظف
            } else {
                alert('Unknown role');
            }
        } catch (err) {
            console.error('Login failed:', err);
            alert('Invalid API Key');
        }
    };

    return (
        <div className="login-page d-flex align-items-center justify-content-center">
            <div className="card login-card shadow-lg p-4">
                <div className="text-center mb-4">
                    <h2 className="fw-bold">Welcome Back 👋</h2>
                    <p className="text-muted">Log in with your API Key</p>
                </div>
                <div className="mb-4">
                    <label className="form-label">API Key</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your API Key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary w-100" onClick={handleLogin}>
                    Login
                </button>
                <div className="text-center mt-3 text-muted small">
                    Powered by Mahmoud Inc. 🚀
                </div>
            </div>
        </div>
    );
}

export default Login;
