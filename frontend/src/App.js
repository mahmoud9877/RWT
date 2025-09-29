import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import Login from './pages/login/Login.jsx';
import AdminEmployees from './pages/admin/Employee/Employee.jsx';
import AdminDashboard from './pages/admin/AdminDashboard/AdminDashboard.jsx';
import UserDashboard from './pages/User/UserDashboard/UserDashboard.jsx';
import AdminRoute from './routes/AdminRoute.jsx';
import EmployeeRoute from './routes/EmployeeRoute.jsx';
import AdminTasks from './pages/admin/Task/Task.jsx';
import LandingPage from './pages/Home.jsx';
import AllReports from './pages/admin/Report/Report.jsx';
import MyTasks from './pages/User/Tasks/Tasks.jsx';
import MyReports from './pages/User/Reports/Reports.jsx';

function Layout({ children }) {
  const location = useLocation();
  const hideNavbarOn = ['/', '/login'];
  const shouldHideNavbar = hideNavbarOn.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      {children}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/employees" element={<AdminRoute><AdminEmployees /></AdminRoute>} />
          <Route path="/admin/tasks" element={<AdminRoute><AdminTasks /></AdminRoute>} />
          <Route path="/admin/reports" element={<AdminRoute><AllReports /></AdminRoute>} />
          <Route path="/employee" element={<EmployeeRoute><UserDashboard /></EmployeeRoute>} />
          <Route path="/employee/tasks" element={<EmployeeRoute><MyTasks /></EmployeeRoute>} />
          <Route path="/employee/reports" element={<EmployeeRoute><MyReports /></EmployeeRoute>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
