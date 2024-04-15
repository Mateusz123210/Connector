import axios from "axios";
import api from "./api"


export interface Register{
    email: string,
    password: string
}


export interface RegisterResponse{
    message: string,
    access_token: string
}


export interface ConfirmRegistration{
    email: string,
    access_token: string
    verification_code: string
}


class RegistrationService {
    private apiUrl: string = api.getApi()

    register(register: Register){
        return axios.post(`${this.apiUrl}/register`, register)
    }

    confirmRegistration(confirmRegistration: ConfirmRegistration){
        return axios.post(`${this.apiUrl}/confirm-registration`, confirmRegistration)
    }
}
export default new RegistrationService();
