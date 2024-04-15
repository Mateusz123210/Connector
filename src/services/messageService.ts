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


class MessageService{
    private apiUrl: string = api.getApi()

    sendMessage(sendMessage: SendMessage){
        return axios.post(`${this.apiUrl}/send-message`, sendMessage)
    }

    getMessage(fetchMessage: FetchMessage){
        return axios.post(`${this.apiUrl}/fetch-message`, fetchMessage)
    }

    getKey(key: Key){
        return axios.post(`${this.apiUrl}/get-key`, key)
    }
}   
export default new MessageService