import { Button, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, TextareaAutosize, Typography} from "@mui/material"
import { useEffect, useState } from "react"
import { Caller, FetchMessage, Key, SendMessage } from "../services/messageService"

import MessageService from "../services/messageService"
import RefreshTokenService, { RefreshToken } from "../services/refreshTokenService"
import AESEncryptor from "../aes/AESEncryptor"







const MessagePage = (props: any) => {

    useEffect(() => {
        handleGetAvailableCallers()

    }, [])

    const getAllMessages = () => {



    }

    const [messages, setMessages] = useState<[]>([])
    const [receiver, setReceiver] = useState<string>("")
    const [currentReceiver, setCurrentReceiver] = useState<string>("")
    const [receivers, setReceivers] = useState<[]>([])
    const [aesKeys, setAesKeys] = useState<Map<string, string>>(new Map<string, string>) 
    const [helperText, setHelperText] = useState<string>("")
    const [addUserHelperText, setAddUserHelperText] = useState<string>("")
    const [messageForm, setMessageForm] = useState<string>("Siema")
    const [messagesShown, setMessagesShown] = useState<string>("")


    const handleGetAvailableCallers = () => {
        const values: Caller = {
            email: props.email,
            access_token: props.tokens.access_token,
        }

        const refreshTokenValues: RefreshToken = {
            email: props.email,
            refresh_token: props.tokens.refresh_token,
          }
        MessageService.getAvailableCallers(values).then((response) => {

            const data = response.data
            setReceivers(data.callers)
          })
          .catch((error) => {
            
            RefreshTokenService.getNewToken(refreshTokenValues).then((response) => {
              const data = response.data
              values.access_token = data.access_token
      
              MessageService.getAvailableCallers(values).then((response) => {
                const data = response.data
                setReceivers(data.callers)
                props.setMyTokens(data.access_token, data.refresh_token)    
      
              })
              .catch((error) => {
          
              })
            })
            .catch((error) => {
        
            })
        })




    }

    const handleAddCaller = async () => {

        // Example aes encryption and decryption
        const key = "549aed15965a08181745a96eec8df7e6"
        const initialization_vector = "9f9a25bc06fa261e"
        const message = "eloedfsewr"
        const encrypted = AESEncryptor.encryptSymmetric(message, key, initialization_vector)
        const decrypted = AESEncryptor.decryptSymmetric((await encrypted).ciphertext, key, initialization_vector)
        console.log((await (encrypted)).ciphertext)
        console.log(await(decrypted))






        // const caller = receiver
        // const res = handleGetAesKey(caller)
        // console.log("result")
        // console.log(res)
        // if(res === true){
        //     setAddUserHelperText("You cannot add this user")
        //     return
        // }else{
        //     setAddUserHelperText("")
        // }
        // if(caller in receivers){
        //     setAddUserHelperText("This user is already added")
        //     return
        // }
        // const allReceivers = receivers
        // console.log(typeof allReceivers)
        // // setReceivers({...receivers, ...caller})



        




    }
    

    const handleMessageSend = () => {
        if(! (aesKeys.has(currentReceiver))){
            handleGetAesKey(currentReceiver)
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
              const data = response.data
              values.access_token = data.access_token
      
              MessageService.sendMessage(values).then((response) => {
                const data = response.data
                console.log(data)
                // console.log("C")
                // setMyTokens("", "")
                // setMyEmail("")
                // hideMenuOnAppBar()
      
              })
              .catch((error) => {
          
              })
            })
            .catch((error) => {
        
            })
        })


    }

    const handleMessageFetch = (rec: string) => {
        const values: FetchMessage = {
            email: props.email,
            access_token: props.tokens.access_token,
            caller: rec
        }

        const refreshTokenValues: RefreshToken = {
            email: props.email,
            refresh_token: props.tokens.refresh_token,
          }
        
        MessageService.getMessage(values).then((response) => {
            const data = response.data
            const messages = data.messages
            


            console.log(data)  

          })
          .catch((error) => {
            
            RefreshTokenService.getNewToken(refreshTokenValues).then((response) => {
              const data = response.data
              values.access_token = data.access_token
      
              MessageService.getMessage(values).then((response) => {
                const data = response.data
                console.log(data)

                props.setMyTokens(data.access_token, data.refresh_token)
      
              })
              .catch((error) => {
          
              })
            })
            .catch((error) => {
        
            })
        })



    }

    const handleGetAesKey = (caller: string) => {
        let fetched = false
        const values: Key = {
            email: props.email,
            access_token: props.tokens.access_token,
            receiver: caller
        }

        const refreshTokenValues: RefreshToken = {
            email: props.email,
            refresh_token: props.tokens.refresh_token,
          }
        MessageService.getKey(values).then((response) => {
            const data = response.data
            const keys = aesKeys
            keys.set(caller, data.key)
            setAesKeys(keys)
            console.log("true")
            fetched = true
          })
          .catch((error) => {
            
            RefreshTokenService.getNewToken(refreshTokenValues).then((response) => {
              const data = response.data
              values.access_token = data.access_token
      
              MessageService.getKey(values).then((response) => {
                const data = response.data
                const keys = aesKeys
                keys.set(caller, data.key)
                setAesKeys(keys)
                props.setMyTokens(data.access_token, data.refresh_token)
                console.log("true")
                fetched = true
              })
              .catch((error) => {
              })
            })
            .catch((error) => {
            })
        })

        return fetched
    }


    const handleChangeReceiver = (rec: string) => {
        setCurrentReceiver(rec)
        if(! (aesKeys.has(rec))){
            handleGetAesKey(rec)
        }
        handleMessageFetch(rec)




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
                    <ListItem disablePadding>
                        <ListItemButton key={rec} onClick={                 
                            handleChangeReceiver.bind(this, rec)                            
                        } sx={{background: rec == currentReceiver? "#cccccc": "#97CFFC" }}>
                            <ListItemText   primary= {rec} />
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