import React, { createContext, useContext} from "react";
import { apiGet, apiPost } from "../utils/api/axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const dataContext = createContext();

const DataProvider = ({children}) => {

  const registerConfig = async(formData) => {
    try{
      const registerData = {
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirm_password, 
        phone: formData.phone
      }

   await apiPost('users/signup', registerData).then((res) =>{
        toast.success(res.data.message);
        localStorage.setItem("signature", res.data.signature)
        setTimeout(()=>{
          window.location.href = "/otp";
        }, 2000)
      })
    }catch(err){
      console.log(err)
      toast.error(err.response.data.Error)
    }
  }

  const OTPConfig = async (formData, signature) => {
    try {
      const otpData = {
        otp: formData
      }
      await apiPost(`/users/verify/${signature}`, formData)
      .then((res)=>{
        toast.success(res.data.message);
        localStorage.setItem("signature", res.data.signature)
        setTimeout(()=>{
          window.location.href = "/otp";
        }, 2000)
      })
    } catch (err) {
      toast.error(err.response.data.Error)
    }
  }

  const ResendOTP = async(signature) => {
    await apiGet(`/users/resend-otp/${signature}`)
    .then((res) => {

    })
  }

  const logout = ()=>{
    localStorage.clear();
    window.location.href = "/login"
  }

  return <dataContext.Provider value={{ registerConfig, OTPConfig, ResendOTP, logout}}>
      {children}
  </dataContext.Provider>;
};


export const useAuth = () => {
  const context = useContext(dataContext);
  if (context === "undefined") {
    throw new Error("useAuth must be used within the auth provider");
  }
  return context;
};

export default DataProvider;


