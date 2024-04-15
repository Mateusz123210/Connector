import { Button, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, TextareaAutosize, Typography} from "@mui/material"
import { useEffect, useState } from "react"







const MessagePage = () => {

    useEffect(() => {
        getAllMessages()


    }, [])

    const getAllMessages = () => {



    }



    const [messages, setMessages] = useState<[]>([])
    const [receiver, setReceiver] = useState<string>("")
    const [helperText, setHelperText] = useState<string>("")
    const [messageForm, setMessageForm] = useState<string>("")
    const [messagesShown, setMessagesShown] = useState<string>("")
    const [peoples, setPeoples] = useState<string>("")

    const handleMessageSend = () => {

    }

    const handleMessageFetch = () => {





    }


    return(
        <Grid container direction={"row"} justifyContent={"center"} width={"80%"}> 

            <Grid item xs={4}>
                <Typography textAlign={"start"} color={"#0C4359"} style={{marginTop: '20px',
                marginBottom: "10px", fontSize: 24}}>
                    People
                </Typography>
                <List
                    sx={{ bgcolor: '#97CFFC', maxHeight: '45vh', overflow: 'auto' }}
                    aria-label="contacts"
                >
                <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary="Friend 1" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary="Friend 2" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary="Friend 2" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary="Friend 2" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary="Friend 2" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary="Friend 2" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary="Friend 2" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary="Friend 2" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary="Friend 2" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary="Friend 2" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary="Friend 2" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary="Friend 2" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton sx={{background: "#cccccc"}}>
                            <ListItemText   primary="Friend 2" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary="Friend 2" />
                        </ListItemButton>
                    </ListItem>
                </List>
                <TextField
                    style={{marginTop: '22px'}}
                    id="newPersonEmail"
                    fullWidth
                    value={""}
                    // onChange={(event) =>
                    //     setSecondPassword(event.target.value)
                    // }
                    // helperText={helperTexts.passwordHelperText}
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