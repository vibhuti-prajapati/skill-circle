import isEmail from "validator/lib/isEmail.js"; 
export const validateEmail = async(email)=>{
    return isEmail(email);
}