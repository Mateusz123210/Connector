import axios from "axios"
import api from "./api"


export interface RefreshToken{
    email: string,
    refresh_token: string
}


class RefreshTokenService{
    private apiUrl: string = api.getApi()

    getNewToken(refreshToken: RefreshToken){
        return axios.post(`${this.apiUrl}/refresh-token`, refreshToken)
    }
}   
export default new RefreshTokenService