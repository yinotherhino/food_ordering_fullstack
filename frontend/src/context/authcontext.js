import React, { createContext} from "react";
import { apiPost } from "../utils/api/axios";
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
      console.log(res.data)
        toast.success(res.data.message);
        setTimeout(()=>{
          window.location.href = "/login";
        }, 2000)
      })
    }catch(err){
      console.log(err)
      toast.error(err.response.data.Error)
    }
  }

  return <dataContext.Provider value={{ registerConfig}}>
      {children}
  </dataContext.Provider>;
};


export const useAuth = () => {
  const context = React.useContext(dataContext);
  if (context === "undefined") {
    throw new Error("useAuth must be used within the auth provider");
  }
  return context;
};

export default DataProvider;


