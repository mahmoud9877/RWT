// import React, { createContext, useState, useEffect } from 'react';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);

//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         const role = localStorage.getItem('role');
//         const name = localStorage.getItem('name');

//         if (token && role) {
//             setUser({ token, role, name });
//         }
//     }, []);

//     const login = (userData) => {
//         localStorage.setItem('token', userData.token);
//         localStorage.setItem('role', userData.role);
//         localStorage.setItem('name', userData.name);
//         setUser(userData);
//     };

//     const logout = () => {
//         localStorage.clear();
//         setUser(null);
//     };

//     return (
//         <AuthContext.Provider value={{ user, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };
