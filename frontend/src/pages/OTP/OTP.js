import React from 'react'
import "../Register/Register.css"
import registerbg from '../../assets/registerbg.svg'
import Card from '../../components/card/Card'
import "./OTP.css"

const OTP = () => {
  return (
    <div className="register-container"> 
        <div className ="bg-background">
          <img src={registerbg} alt=" " />
        </div>
        <div className='form-style'>
        <Card>
            <h3>OTP Verification</h3>
            <p>Fill in your OTP Verification code</p>
            <form>
                <div>
                    <label htmlFor="otp">OTP</label>
                    <div className = "OTP-field">
                        <input type="text" name="otp" id="otp" placeholder=''/>
                        <input type="text" name="otp" id="otp" placeholder=''/>
                        <input type="text" name="otp" id="otp" placeholder=''/>
                        <input type="text" name="otp" id="otp" placeholder=''/>
                    </div>
                    
                </div>
                <div>
                    <div></div>
                    <div className='btn-container'>
                        <button type="submit">Verify</button>
                    </div>
                </div>
            </form>
            <p>Didn't get OTP? <span className="new-btn-style">Resend OTP</span></p>
        </Card>
        </div>
    </div>
  )
}

export default OTP