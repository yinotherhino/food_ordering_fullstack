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
            <Route path="/restaurant" element={<Restaurant />} />
            <Route path="/otp" element={<OTP />} />
            {/* <Route path="/contact" element={<Contact />} /> */}
          </Routes>
      </Router>
    </DataProvider>
    </React.Fragment>
  );
}

export default App;
