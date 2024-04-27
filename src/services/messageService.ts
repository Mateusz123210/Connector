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

    async sendMessage(sendMessage: SendMessage){
        return await axios.post(`${this.apiUrl}/send-message`, sendMessage)
    }

    async getMessage(fetchMessage: FetchMessage){
        return await axios.post(`${this.apiUrl}/get-messages`, fetchMessage)
    }

    async getKey(key: Key){
        return await axios.post(`${this.apiUrl}/get-key`, key)
    }

    async getAvailableCallers(caller: Caller){
        return await axios.post(`${this.apiUrl}/get-available-callers`, caller)
    }
} 
  
export default new MessageService()