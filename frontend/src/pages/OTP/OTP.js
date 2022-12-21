import React, {useState} from 'react'
import "../Register/Register.css"
import registerbg from '../../assets/registerbg.svg'
import Card from '../../components/card/Card'
import "./OTP.css"
import OTPinputfield from 'react-otp-input'
import { useAuth } from '../../context/authcontext'

const OTP = () => {
    const {OTPConfig} = useAuth()
    const [otp, setOtp] = useState('')
    const handleChange = (otp)=>{
        setOtp(otp)
    }

    const handleSubmit = (e)=>{
        e.preventDefault()
        const getSignature = localStorage.getItem("signature")
        OTPConfig(otp, getSignature)
    }

  return (
    <div className="register-container"> 
        <div className ="bg-background">
          <img src={registerbg} alt=" " />
        </div>
        <div className='form-style' >
        <Card>
            <h3 style={{"margin-top":"15px", "font-family":""}}>OTP Verification</h3>
            <p>Fill in your OTP Verification code</p>
            <form onSubmit={handleSubmit} >
                <div>
                    <label htmlFor="otp">OTP</label>
                    <div className = "OTP-field">
                    <OTPinputfield 
                        value={otp}
                        onChange={handleChange}
                        numInputs={4}
                        inputStyle={{
                            "color":"black",
                            "width":"2.8rem",
                            "border":"1px solid #d9d9d9",
                            "boxSizing":"border-box",
                            "outline":"none",
                            "padding":"3px",
                            "marging":"3px"

                        }}
                    />
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