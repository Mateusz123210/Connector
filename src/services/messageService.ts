import axios from "axios"
import api from "./api"


export interface SendMessage{
    email: string,
    access_token: string
    message: string
    receiver: string
}


export interface FetchMessage{
    email: string,
    access_token: string
    caller: string
}

export interface Key{
    email: string,
    access_token: string
    receiver: string
}

export interface Caller{
    email: string,
    access_token: string
}


class MessageService{
    private apiUrl: string = api.getApi()

    sendMessage(sendMessage: SendMessage){
        return axios.post(`${this.apiUrl}/send-message`, sendMessage)
    }

    getMessage(fetchMessage: FetchMessage){
        return axios.post(`${this.apiUrl}/get-messages`, fetchMessage)
    }

    getKey(key: Key){
        return axios.post(`${this.apiUrl}/get-key`, key)
    }

    getAvailableCallers(caller: Caller){
        return axios.post(`${this.apiUrl}/get-available-callers`, caller)
    }
}   
export default new MessageService()