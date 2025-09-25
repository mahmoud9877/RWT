import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import App from './App.js';

function AppWrapper() {
    return (
        <Router>
            <AuthProvider>
                <App />
            </AuthProvider>
        </Router>
    );
}

export default AppWrapper;
