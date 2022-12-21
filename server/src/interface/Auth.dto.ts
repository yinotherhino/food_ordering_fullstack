export type Authpayload = VendorPayload | UserPayLoad

interface VendorPayload {
    id:string;
    email:string;
    serviceAvailable:boolean;
}
interface UserPayLoad{
    id:string;
    verified:boolean;
    email:string;
}