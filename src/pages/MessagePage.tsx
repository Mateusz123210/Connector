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

    const [messages, setMessages] = useState<string[]>([])
    const [receiver, setReceiver] = useState<string>("")
    const [currentReceiver, setCurrentReceiver] = useState<string>("")
    const [receivers, setReceivers] = useState<any[]>([])
    const [aesKeys, setAesKeys] = useState<Map<string, string>>(new Map<string, string>) 
    const [initializationVectors, setInitializationVectors] = useState<Map<string, string>>(new Map<string, string>) 
    const [helperText, setHelperText] = useState<string>("")
    const [addUserHelperText, setAddUserHelperText] = useState<string>("")
    const [messageForm, setMessageForm] = useState<string>("Siema")
    const [messagesShown, setMessagesShown] = useState<string>("")


    const handleGetAvailableCallers = async () => {
        var values: Caller = {
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
            if(error.response.request.status === 401 || error.response.request.status === 403){
            
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
            }
        })
        var unnecessary_variable2 = await unneccessary_variable
    }

    const handleAddCaller = async () => {

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
        const messagesFetched = await handleMessageFetch(caller)

        if(messagesFetched !== null){
            convertMessagesAndShow(messagesFetched, receiver)
        }else{
            setMessagesShown("")
            setHelperText("Cannot fetch messages")
        }

    }

    const handleGetAesKey = async (caller: string): Promise<boolean> => {
        var fetched = false
        var values: Key = {
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
            const init_vectors = initializationVectors
            init_vectors.set(caller, data.initialization_vector)
            setInitializationVectors(init_vectors)
            fetched = true
          })
          .catch((error) => {
            if(error.response.request.status === 401 || error.response.request.status === 403){
                RefreshTokenService.getNewToken(refreshTokenValues).then((response) => {
                const refresh_token_data = response.data
                values.access_token = refresh_token_data.access_token
        
                MessageService.getKey(values).then((response) => {
                    const data = response.data
                    const keys = aesKeys
                    keys.set(caller, data.key)
                    setAesKeys(keys)
                    const init_vectors = initializationVectors
                    init_vectors.set(caller, data.initialization_vector)
                    setInitializationVectors(init_vectors)
                    props.setMyTokens(refresh_token_data.access_token, refresh_token_data.refresh_token)
                    fetched = true
                })
                .catch((error) => {
                })
                })
                .catch((error) => {
                })
            }
        })

        const unnecessary_variable2 = await unnecessary_variable

        return fetched
    }
    

    const handleMessageSend = async () => {
        if(currentReceiver.length === 0){
            setHelperText("Choose receiver first")
            return
        }
        if(messageForm.length === 0){
            setHelperText("You cannot send empty message")
            return
        }

        if(! (aesKeys.has(currentReceiver))){
            handleGetAesKey(currentReceiver)
            if(! handleGetAesKey(currentReceiver)){
                setHelperText("Error in sending message")
                return
            }else{
                setMessageForm("")
            }
        }
        const key = aesKeys.get(currentReceiver)
        const initializationVector = initializationVectors.get(currentReceiver)
        const encrypted = (await (AESEncryptor.encryptSymmetric(messageForm, key as string, initializationVector as string))).ciphertext

        // var hashedMessage = 


        var values: SendMessage = {
            email: props.email,
            access_token: props.tokens.access_token,
            message: encrypted,
            receiver: currentReceiver
        }

        const refreshTokenValues: RefreshToken = {
            email: props.email,
            refresh_token: props.tokens.refresh_token,
          }
        
        var unnecessary_variable = MessageService.sendMessage(values).then((response) => {

          })
          .catch((error) => {
            if(error.response.request.status === 401 || error.response.request.status === 403){
            
                RefreshTokenService.getNewToken(refreshTokenValues).then((response) => {
                const refresh_token_data = response.data
                values.access_token = refresh_token_data.access_token
        
                MessageService.sendMessage(values).then((response) => {
                    const data = response.data
                    props.setMyTokens(refresh_token_data.access_token, refresh_token_data.refresh_token)
        
                })
                .catch((error) => {
            
                })
                })
                .catch((error) => {
            
                })
            }
        })
        await unnecessary_variable
        const messagesFetched = await handleMessageFetch(currentReceiver)
        if(messagesFetched !== null){
            convertMessagesAndShow(messagesFetched, currentReceiver)
        }else{
            setMessagesShown("")
            setHelperText("Cannot fetch messages")
        }
    }

    const handleMessageFetch = async (rec: string) => {
        var messages_fetched = null
        var values: FetchMessage = {
            email: props.email,
            access_token: props.tokens.access_token,
            caller: rec
        }

        const refreshTokenValues: RefreshToken = {
            email: props.email,
            refresh_token: props.tokens.refresh_token,
          }
        
        var unnecessary_variable = MessageService.getMessage(values).then(async (response) => {
            if(response.status == 200){
                const data = response.data
                var messages1 = data.messages
                setMessages(messages1.map((first: any) => ({first})))

                messages_fetched = messages1
            }else{
                setMessages([])
                messages_fetched = []
            }

          })
          .catch((error) => {
            if(error.response.request.status === 401 || error.response.request.status === 403){
                RefreshTokenService.getNewToken(refreshTokenValues).then(async (response) => {
                    const refresh_token_data = response.data
                    values.access_token = refresh_token_data.access_token
            
                    MessageService.getMessage(values).then(async (response) => {
                      const data = response.data
                      var messages1 = data.messages
                      setMessages(messages1.map((first: any) => ({first})))
                      props.setMyTokens(refresh_token_data.access_token, refresh_token_data.refresh_token)
                      messages_fetched = messages1
            
                    })
                    .catch((error) => {
                          
                    })
                  })
                  .catch((error) => {
      
                  })

            }
        })
        var unnecessary_variable2 = await unnecessary_variable
        return messages_fetched
    }

    const handleChangeReceiver = async (rec: string) => { 
        setCurrentReceiver(rec)
        setMessageForm("")
        if(! (aesKeys.has(rec))){
            if(await handleGetAesKey(rec) === false){
                setHelperText("Cannot fetch messages!")
                return
            }              
        }
        const message_fetch_result = await handleMessageFetch(rec)
        if(message_fetch_result === null){
            setHelperText("Cannot fetch messages!")
            setMessagesShown("")
        }
        else{
            setHelperText("")
            convertMessagesAndShow(message_fetch_result, rec)
        }
    }

    const convertMessagesAndShow = async (allMessages: any, rec: string) => {
        var newMessages = ""
        
        const key = aesKeys.get(rec)
        const initializationVector = initializationVectors.get(rec)

        let msg = ""

        for (let i = 0; i < allMessages.length; i++) {
            let obj = JSON.parse(JSON.stringify(allMessages[i]))
            let direction = ""
            for (let k in obj){
                msg = k
                direction = obj[k]
            }
            msg = await AESEncryptor.decryptSymmetric(msg, key as string, initializationVector as string)
            if(direction === 'from_first'){
                newMessages += "(You)\n" 
                newMessages += msg
                newMessages += "\n"
            }else{
                newMessages += "(" + rec +  ")\n" 
                newMessages += msg 
                newMessages += "\n"
            }         

        }
        await msg
        setMessagesShown(newMessages)

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
            

            <Typography textAlign={"start"} color={"#fe0000"} style={{marginTop: '5px', fontSize: 24}}>
                {helperText}
            </Typography>


        </Grid>
    )

}

export default MessagePage