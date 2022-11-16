export const generateOtp = ()=>{
    const otp = Math.floor(Math.random() * 100000);
    const expiry = new Date();
    expiry.setTime(new Date().getTime() + (300000))
    return {otp, expiry}
}