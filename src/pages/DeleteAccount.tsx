import { Button, Grid, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Validator from "../validators/Validator"
import DeleteAccountService, { DeleteAccount } from "../services/deleteAccountService"
import RefreshTokenService from "../services/refreshTokenService"
import { RefreshToken } from "../services/refreshTokenService"

const DeleteAccountPage = (props: any) => {
    const navigate = useNavigate()

    const [password, setPassword] = useState<string>("")
    const [helperText, setHelperText] = useState<string>("")
    const [result, setResult] = useState<string>("")

    useEffect(() => {
        setPassword("")
        setHelperText("")
        setResult("")
    }, [])

    const deleteAccount = () => {
        var success = true
        var password_error = ""
        if(!Validator.validatePassword(password)){
            success = false
            password_error = Validator.invalidPasswordMessage
        }
        if(success === false){
            setHelperText(password_error)
            return
        }else{
            setHelperText("")
        }

        var values: DeleteAccount = {
            email: props.email,
            access_token: props.tokens.access_token,
            password: password
        }

        const refreshTokenValues: RefreshToken = {
            email: props.email,
            refresh_token: props.tokens.refresh_token,
          }
        
        DeleteAccountService.deleteAccount(values).then(async (response) => {
            if(response.status == 200){
                props.setMyTokens("", "")
                props.hideMenuOnAppBar()
                navigate("/")
            }

          })
          .catch((error) => {
            if(error.response.request.status === 401 || error.response.request.status === 403){
                RefreshTokenService.getNewToken(refreshTokenValues).then(async (response) => {
                    const refresh_token_data = response.data
                    values.access_token = refresh_token_data.access_token
            
                    DeleteAccountService.deleteAccount(values).then(async (response) => {
                        props.setMyTokens("", "")
                        props.hideMenuOnAppBar()
                        navigate("/")
            
                    })
                    .catch((error) => {
                        setResult(error.response.data.detail)
                    })
                  })
                  .catch((error) => {
      
                  })

            }else{
                setResult(error.response.data.detail)
            }
        })

    }

    return(
        
        <Grid  width={"50%"}  marginTop={15} direction={"row"}>
            <Typography variant="h3" textAlign={"center"} color={"#FB6148"}>
                Are you sure, you want to delete account?
            </Typography>
            <Typography  textAlign={"start"} color={"#0C4359"} style={{marginTop: '30px', fontSize: 24}}>
                Write your password below
            </Typography>
            
            <TextField
                style={{marginTop: '20px'}}
                id="password"
                type="password"
                fullWidth
                value={password}
                onChange={(event) =>
                    setPassword(event.target.value)
                }
                helperText={helperText}>
            </TextField>

            <Button  style={{background: '#F13011', color: "#ffffff", fontSize: 28, width:"100%", marginTop: 30}}
                onClick={deleteAccount}>
                Delete account
            </Button>
            <Typography  textAlign={"start"} color={"#FB6148"} style={{marginTop: '30px', fontSize: 24}}>
                {result}
            </Typography>
            <Button  style={{background: '#214757', fontSize: 28, width:"100%", marginTop: 30}}
                onClick={(e) => {navigate("/")}}>
                Return
            </Button>
        </Grid>
    )

}

export default DeleteAccountPage
// email, password, access_token