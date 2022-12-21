import React from 'react'
import Logo from '../../assets/logo.svg'
import {Link} from 'react-router-dom'
import './Navbar.css'
import { useAuth } from '../../context/authcontext'

const Navbar = () => {
  const {logout} = useAuth();
  const getSignature = localStorage.getItem("signature");


  return (
    <nav >
        <div className="logo-container">
            <img src={Logo} alt="logo" />
            <h3>Food Review Blog</h3>
        </div>
        <ul>
            <li className='active'> <Link to="/" className='link'>Home</Link></li>
            <li><Link to="/restaurant " className='link'>Restaurants</Link></li>
            {
              !getSignature ? (<><li><Link to="/login" className='link'>Login</Link></li>
            <li><Link to="/register" className='link'>Signup</Link></li> </>) : 
            <li><Link onClick={logout} className='link'>Logout</Link></li>
            }
        </ul>
    </nav>
   
  )
}

export default Navbar