import axios from "axios"
import api from "./api"


export interface DeleteAccount{
    email: string,
    password: string,
    access_token: string
}


class DeleteAccountService{
    private apiUrl: string = api.getApi()

    deleteAccount(deleteAccount: DeleteAccount){
        return axios.post(`${this.apiUrl}/delete-account`, deleteAccount)
    }
}   

export default new DeleteAccountService()