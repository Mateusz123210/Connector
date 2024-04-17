import { Button, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, TextareaAutosize, Typography} from "@mui/material"
import { useEffect, useState } from "react"
import { Caller, FetchMessage, Key, SendMessage } from "../services/messageService"

import MessageService from "../services/messageService"
import RefreshTokenService, { RefreshToken } from "../services/refreshTokenService"
import AESEncryptor from "../aes/AESEncryptor"
import Validator from "../validators/Validator"







const MessagePage = (props: any) => {

    useEffect(() => {
        setMessageForm("")
        setMessagesShown("")
        setHelperText("")
        setAddUserHelperText("")
        setCurrentReceiver("")
        // setMessages([])
        handleGetAvailableCallers()
    }, [])

    const getAllMessages = () => {



    }

    const [messages, setMessages] = useState<string[]>([])
    const [receiver, setReceiver] = useState<string>("")
    const [currentReceiver, setCurrentReceiver] = useState<string>("")
    const [receivers, setReceivers] = useState<any[]>([])
    const [aesKeys, setAesKeys] = useState<Map<string, string>>(new Map<string, string>) 
    const [helperText, setHelperText] = useState<string>("")
    const [addUserHelperText, setAddUserHelperText] = useState<string>("")
    const [messageForm, setMessageForm] = useState<string>("Siema")
    const [messagesShown, setMessagesShown] = useState<string>("")


    const handleGetAvailableCallers = async () => {
        const values: Caller = {
            email: props.email,
            access_token: props.tokens.access_token,
        }

        const refreshTokenValues: RefreshToken = {
            email: props.email,
            refresh_token: props.tokens.refresh_token,
          }
        var unneccessary_variable = await MessageService.getAvailableCallers(values).then((response) => {

            const data = response.data
            setReceivers(data.callers)
          })
          .catch((error) => {
            
            RefreshTokenService.getNewToken(refreshTokenValues).then((response) => {
              const refresh_token_data = response.data
              values.access_token = refresh_token_data.access_token
      
              MessageService.getAvailableCallers(values).then((response) => {
                const data = response.data
                setReceivers(data.callers)
                props.setMyTokens(refresh_token_data.access_token, refresh_token_data.refresh_token)    
      
              })
              .catch((error) => {
          
              })
            })
            .catch((error) => {
        
            })
        })
        var unnecessary_variable2 = await unneccessary_variable
    }

    const handleAddCaller = async () => {

        // Example aes encryption and decryption
        // const key = "549aed15965a08181745a96eec8df7e6"
        // const initialization_vector = "9f9a25bc06fa261e"
        // const message = "eloedfsewr"
        // const encrypted = AESEncryptor.encryptSymmetric(message, key, initialization_vector)
        // const decrypted = AESEncryptor.decryptSymmetric((await encrypted).ciphertext, key, initialization_vector)
        // console.log((await (encrypted)).ciphertext)
        // console.log(await(decrypted))






        const caller = receiver
        if(!Validator.validateEmail(caller)){
            setAddUserHelperText("Invalid email")
            return
        }
        for(let i = 0; i < receivers.length; i++){
            if(receivers[i] == caller){
                setAddUserHelperText("This user is already added")
                return
            }
        }
        const res = await handleGetAesKey(caller)
        if(res === false){
            setAddUserHelperText("You cannot add this user")
            return
        }else{
            setAddUserHelperText("")
        }
        var allReceivers = receivers
        allReceivers.push(String(caller))
        setReceivers(allReceivers)
        setReceiver("")
        setCurrentReceiver(caller)
        setMessageForm("")
        handleMessageFetch(caller)

    }

    const handleGetAesKey = async (caller: string): Promise<boolean> => {
        var fetched = false
        const values: Key = {
            email: props.email,
            access_token: props.tokens.access_token,
            receiver: caller
        }

        const refreshTokenValues: RefreshToken = {
            email: props.email,
            refresh_token: props.tokens.refresh_token,
          }
        const unnecessary_variable = MessageService.getKey(values).then((response) => {
            const data = response.data
            const keys = aesKeys
            keys.set(caller, data.key)
            setAesKeys(keys)
            fetched = true
          })
          .catch((error) => {
            
            RefreshTokenService.getNewToken(refreshTokenValues).then((response) => {
              const refresh_token_data = response.data
              values.access_token = refresh_token_data.access_token
      
              MessageService.getKey(values).then((response) => {
                const data = response.data
                const keys = aesKeys
                keys.set(caller, data.key)
                setAesKeys(keys)
                props.setMyTokens(refresh_token_data.access_token, refresh_token_data.refresh_token)
                fetched = true
              })
              .catch((error) => {
              })
            })
            .catch((error) => {
            })
        })

        const unnecessary_variable2 = await unnecessary_variable

        return fetched
    }
    

    const handleMessageSend = () => {

        if(! (aesKeys.has(currentReceiver))){
            handleGetAesKey(currentReceiver)
            if(! handleGetAesKey(currentReceiver)){
                setHelperText("Error in sending message")
            }else{
                setMessageForm("")
            }
        }

        const values: SendMessage = {
            email: props.email,
            access_token: props.tokens.access_token,
            message: messageForm,
            receiver: currentReceiver
        }

        const refreshTokenValues: RefreshToken = {
            email: props.email,
            refresh_token: props.tokens.refresh_token,
          }
        
        MessageService.sendMessage(values).then((response) => {
            console.log("message sent")
          })
          .catch((error) => {
            
            RefreshTokenService.getNewToken(refreshTokenValues).then((response) => {
              const refresh_token_data = response.data
              values.access_token = refresh_token_data.access_token
      
              MessageService.sendMessage(values).then((response) => {
                const data = response.data
                console.log(data)
                props.setMyTokens(refresh_token_data.access_token, refresh_token_data.refresh_token)
      
              })
              .catch((error) => {
          
              })
            })
            .catch((error) => {
        
            })
        })

        handleMessageFetch(currentReceiver)
    }

    const handleMessageFetch = async (rec: string) => {
        const values: FetchMessage = {
            email: props.email,
            access_token: props.tokens.access_token,
            caller: rec
        }

        const refreshTokenValues: RefreshToken = {
            email: props.email,
            refresh_token: props.tokens.refresh_token,
          }
        
        MessageService.getMessage(values).then(async (response) => {
            const data = response.data
            var messages1 = await data.messages
            setMessages(messages1.map((first: any) => ({first})))


            console.log(data)  
            return messages1

          })
          .catch((error) => {
            
            RefreshTokenService.getNewToken(refreshTokenValues).then(async (response) => {
              const refresh_token_data = (await response).data
              values.access_token = refresh_token_data.access_token
      
              MessageService.getMessage(values).then(async (response) => {
                const data = response.data
                var messages1 = await data.messages
                setMessages(messages1.map((first: any) => ({first})))
                console.log(data)
                props.setMyTokens(refresh_token_data.access_token, refresh_token_data.refresh_token)
                return messages1
      
              })
              .catch((error) => {
                return null
              })
            })
            .catch((error) => {
                return null
            })
        })
    }

    // do poprawy warunki
    const handleChangeReceiver = async (rec: string) => { 
        setCurrentReceiver(rec)
        setMessageForm("")
        if(! (aesKeys.has(rec))){
            if(await handleGetAesKey(rec) === false){
                setHelperText("Cannot fetch messages!")
                console.log("Aes fetch error")
            }
            else{
                setHelperText("")
            }                
        }
        // const message_fetch_result = await handleMessageFetch(rec)
        // console.log(message_fetch_result)
        // if(message_fetch_result === null){
        //     setHelperText("Cannot fetch messages!")
        //     setMessagesShown("")
        //     console.log("Message fetch error")
        // }
        // else{
        //     setHelperText("")
        //     convertMessagesAndShow(message_fetch_result)
        // }
    }

    const convertMessagesAndShow = (all_messages: any) => {
        console.log("convert")
        var newMessages = ""
        console.log("All messages")
        console.log(all_messages)
        // for (let i = 0; i < all_messages.length; i++) {
        //     console.log(all_messages[i])
        //     // let obj = JSON.parse(all_messages[i])
        //     // console.log(obj)
        //     // console.log(typeof obj)
        // }


    }


    return(
        <Grid container direction={"row"} justifyContent={"center"} width={"80%"}> 

            <Grid item xs={4}>
                <Typography textAlign={"start"} color={"#0C4359"} style={{marginTop: '20px',
                marginBottom: "10px", fontSize: 24}}>
                    People
                </Typography>
                <List
                    sx={{ bgcolor: '#97CFFC', minHeight: '45vh', maxHeight: '45vh', overflow: 'auto' }}
                    aria-label="contacts"
                >
                {receivers.map((rec) => (
                    <ListItem key={rec} disablePadding>
                        <ListItemButton key={rec} onClick={                 
                            handleChangeReceiver.bind(this, rec)                            
                        } sx={{background: rec == currentReceiver? "#cccccc": "#97CFFC" }}>
                            <ListItemText key={rec}   primary= {rec} />
                        </ListItemButton>
                    </ListItem>
                ))}
                </List>
                <TextField
                    style={{marginTop: '22px'}}
                    id="newPersonEmail"
                    fullWidth
                    value={receiver}
                    onChange={(event) =>
                        setReceiver(event.target.value)
                    }
                    helperText={addUserHelperText}
                    >
                </TextField>
                <Button  style={{background: '#214757', fontSize: 28, width:"100%", marginTop: "8px"}}
                        onClick={handleAddCaller}>
                        Add person
                </Button>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={7}>
                <Typography textAlign={"start"} color={"#0C4359"} style={{marginTop: '20px',
                marginBottom: '10px', fontSize: 24}}>
                    Messages
                </Typography>
                <TextareaAutosize
                    id="messages"
                    minRows={25}
                    maxRows={25}
                    readOnly={true}
                    value={messagesShown}
                    style={{ width: "100%", resize: "none", background: "#CBE2EF", overflow: 'auto' }}
                />

                <Grid container direction={"row"}>
                    <Grid item xs={9}>
                    <TextareaAutosize
                        id="newMessage"
                        minRows={7}
                        maxRows={7}
                        readOnly={false}
                        value={messageForm}
                        onChange={(event) =>
                            setMessageForm(event.target.value)
                        }
                        style={{ width: "100%", resize: "none", background: "#CBE6FC", overflow: 'auto' }}
                    />

                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={2}>
                    <Button  style={{background: '#214757', fontSize: 28, width:"100%", marginTop: "20px"}}
                        onClick={handleMessageSend}>
                        Send
                    </Button>

                    </Grid>
                </Grid>


            </Grid>
            

            {/* <Typography textAlign={"start"} color={"#0C4359"} style={{marginTop: '50px', fontSize: 24}}>
                Receiver
            </Typography>

            <TextField
                style={{marginTop: '20px'}}
                id="receiver"
                fullWidth
                value={receiver}
                onChange={(event) =>
                    setReceiver(event.target.value)
                }
                helperText={helperText}>
            </TextField>
            <Typography textAlign={"start"} color={"#0C4359"} style={{marginTop: '50px', fontSize: 24}}>
                Message
            </Typography>
            <TextField
                style={{marginTop: '20px'}}
                id="message"
                fullWidth
                value={messageForm}
                onChange={(event) =>
                    setMessageForm(event.target.value)
                }>
            </TextField>

            <Button  style={{background: '#214757', fontSize: 28, width:"100%", marginTop: 40}}
                onClick={handleMessageSend}>
                Send
            </Button>
            <Button  style={{background: '#214757', fontSize: 28, width:"100%", marginTop: 40}}
                onClick={handleMessageFetch}>
                RefreshMessages
            </Button> */}

        </Grid>
    )



}

export default MessagePage