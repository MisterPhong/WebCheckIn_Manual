import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/login_page/LoginPage';
import DashboardPage from './components/dashboard_normal/DashboardPage';
import DashboardPage1 from './components/dashboard_sick/DashboardPage1';
import DashboardPage2 from './components/dashboard_ business/DashboardPage2';
import Welcome from './components/main_page/Welcome';
import ChnageManu from './components/menu_all/ChnageManu';
import Manual from './components/menu_all/Manual';
import ManualSup from './components/menu_all/ManualS';
import Admin from './components/admin_page/Admin';
import AdminLogin from './components/admin_page/AdminLogin';
import TableNormal from './components/table_page/table_normal';
import TableAdmin from './components/table_admin/TableAdmin';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard1" element={<DashboardPage1 />} />
        <Route path="/dashboard2" element={<DashboardPage2 />} />
        <Route path="/manuals" element={<Manual />} />
        <Route path="/menu" element={<ChnageManu />} />
        <Route path="/menus" element={<ManualSup />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/tablenormal" element={<TableNormal />} />
        <Route path="/tableadmin" element={<TableAdmin />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/" element={<Welcome />} />
      </Routes>
    </Router>
  );
};

export default App;
