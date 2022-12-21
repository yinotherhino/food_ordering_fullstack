import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import React from 'react';
import Register from "./pages/Register/Register"
import Home from './pages/Home/Home';
import Login from "./pages/Login/Login"
import Restaurant from './pages/Restaurant/Restaurant';
import OTP from './pages/OTP/OTP';
import DataProvider from "./context/authcontext";
import {ToastContainer} from 'react-toastify'
import AdminDashboard from './pages/AdminDashboard/AdminDashboard'
import ProtectRoute from './context/ProtectRoute';
import ProtectAdminRoute from './context/ProtectAdminRoute';
import ProtectVendorRoute from './context/ProtectVendorRoute';

function App() {
  return (
    <React.Fragment>
       <DataProvider>
        <ToastContainer />
        <Router>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/restaurant" element={<ProtectRoute> <Restaurant /> </ProtectRoute>} />
            <Route path="/otp" element={<OTP />} />
            <Route path="/admin/dashboard" element={<ProtectAdminRoute> <AdminDashboard /> </ProtectAdminRoute>} />
          </Routes>
      </Router>
    </DataProvider>
    </React.Fragment>
  );
}

export default App;
