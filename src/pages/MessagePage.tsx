import { Button, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, TextareaAutosize, Typography} from "@mui/material"
import { useEffect, useState } from "react"
import { Caller, FetchMessage, SendMessage } from "../services/messageService"

import MessageService from "../services/messageService"
import RefreshTokenService, { RefreshToken } from "../services/refreshTokenService"







const MessagePage = (props: any) => {

    useEffect(() => {
        handleGetAvailableCallers()
        // handleMessageFetch()


    }, [])

    const getAllMessages = () => {



    }

    const [messages, setMessages] = useState<[]>([])
    const [receiver, setReceiver] = useState<string>("")
    const [receivers, setReceivers] = useState<[]>([])
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
          console.log("D")
        MessageService.getAvailableCallers(values).then((response) => {
            console.log("E")
            const data = response.data
            setReceivers(data.callers)
            console.log("C")
          })
          .catch((error) => {
            
            RefreshTokenService.getNewToken(refreshTokenValues).then((response) => {
              const data = response.data
              values.access_token = data.access_token
      
              MessageService.getAvailableCallers(values).then((response) => {
                const data = response.data
                setReceivers(data.callers)
                console.log("C")
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

    const handleAddCaller= () => {
        const caller = receiver




        




    }
    

    const handleMessageSend = () => {
        const values: SendMessage = {
            email: props.email,
            access_token: props.tokens.access_token,
            message: messageForm,
            receiver: receiver
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

    const handleMessageFetch = () => {
        const values: FetchMessage = {
            email: props.email,
            access_token: props.tokens.access_token,
            caller: receiver
        }

        const refreshTokenValues: RefreshToken = {
            email: props.email,
            refresh_token: props.tokens.refresh_token,
          }
        
          console.log("values")
          console.log(values)
        MessageService.getMessage(values).then((response) => {
            console.log("message got")
          })
          .catch((error) => {
            
            RefreshTokenService.getNewToken(refreshTokenValues).then((response) => {
              const data = response.data
              values.access_token = data.access_token
      
              MessageService.getMessage(values).then((response) => {
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

    const handleChangeReceiver = (rec: string) => {
        console.log(rec)
        console.log("receiver changed")


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
                        <ListItemButton key={rec} onClick={() => {                            
                            handleChangeReceiver.bind(this, rec)                            
                            } } sx={{background: "#cccccc"}}>
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
                        onClick={handleMessageSend}>
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