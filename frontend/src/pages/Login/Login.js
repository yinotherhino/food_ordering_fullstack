import React from 'react'
import '../Register/Register.css'
import registerbg from '../../assets/registerbg.svg'
import Card from '../../components/card/Card'
import Navbar from '../../components/Navbar/Navbar'
// import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div className='register-container'>
  
        <div className ="bg-background">
            <img src={registerbg} alt=" " />
        </div>
        <div className='form-style'>
        
            <Card >
              <form>
                <div>
                  <label htmlFor="email">Email</label>
                  <input type="email" name="email" id="email" />
                </div>
                <div>
                  <label htmlFor="password">Password</label>
                  <input type="password" name="password" id="password" />
                </div>
               

                <div>
                  <div></div>
                  <div className='btn-container'>
                    {/* <button type="submit"><Link to="/register" className="link">Register</Link></button> */}
                    <button type="submit">Login</button>
                  </div>
                </div>
                
              </form>
 

            </Card>
        </div>
    </div>
  )
}

export default Login