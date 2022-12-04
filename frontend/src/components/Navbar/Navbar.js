import React from 'react'
import Logo from '../../assets/logo.svg'
import {Link} from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  return (
    <nav >
        <div class="logo-container">
            <img src={Logo} alt="logo" />
            <h3>Food Review Blog</h3>
        </div>
        <ul>
            <li className='active'> <Link to="/" className='link'>Home</Link></li>
            <li><Link to="/restaurant " className='link'>Restaurants</Link></li>
            <li><Link to="/login" className='link'>Login</Link></li>
            <li><Link to="/register" className='link'>Signup</Link></li>
        </ul>
    </nav>
   
  )
}

export default Navbar