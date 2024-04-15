import axios from "axios";
import api from "./api"


export interface Login{
    email: string,
    password: string
}


export interface LoginResponse{
    message: string,
    access_token: string
}


export interface ConfirmLogin{
    email: string,
    access_token: string
    verification_code: string
}


export interface ConfirmLoginResponse{
    message: string,
    access_token: string,
    refresh_token: string
}


export interface Logout{
    email: string,
    access_token: string,
}


class LoginService {
    private apiUrl: string = api.getApi()

    login(login: Login){
        const params = new URLSearchParams();
        params.append('username', login.email);
        params.append('password', login.password);
        return axios.post(`${this.apiUrl}/login`, params)
    }

    confirmLogin(confirmLogin: ConfirmLogin){
        return axios.post(`${this.apiUrl}/confirm-login`, confirmLogin)
    }

    logout(logout: Logout){
        return axios.post(`${this.apiUrl}/logout`, logout)
    }
}
export default new LoginService();