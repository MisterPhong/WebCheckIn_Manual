import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import DashboardPage1 from './components/DashboardPage1';
import DashboardPage2 from './components/DashboardPage2';
import Welcome from './components/Welcome';
import ChnageManu from './components/ChnageManu';
import Manual from './components/Manual';
import ManualSup from './components/ManualS';
import Admin from './components/Admin';
import AdminLogin from './components/AdminLogin';

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
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/" element={<Welcome />} />
      </Routes>
    </Router>
  );
};

export default App;
