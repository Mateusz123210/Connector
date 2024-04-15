import { Button, Grid, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import LoginService, { LoginResponse } from "../services/loginService"
import { Login } from "../services/loginService"
import Validator from "../validators/Validator"


export interface HelperTexts{
    loginHelperText: string,
    passwordHelperText: string,
    loginResultHelperText: string
}


const LoginPage = (props: any) => {
    const navigate = useNavigate()

    const[credentials, setCredentials] = useState<Login>({
        email: "",
        password: ""
    })

    const[helperTexts, setHelperTexts] = useState<HelperTexts>({
        loginHelperText: "",
        passwordHelperText: "",
        loginResultHelperText: ""
    })

    const clearHelperTexts = () => {
        setHelperTexts({
            loginHelperText: "",
            passwordHelperText: "",
            loginResultHelperText: ""
        })
    }

    const handleLogin = () => {
        var success = true
        var email_error = ""
        var password_error = ""
        if(!Validator.validateEmail(credentials.email)){
            email_error = Validator.invalidEmailMessage
            success = false
        }
        if(!Validator.validatePassword(credentials.password)){
            success = false
            password_error = Validator.invalidPasswordMessage
        }
        if(success === false){
            setHelperTexts({loginHelperText: email_error, passwordHelperText: password_error, loginResultHelperText: ""})
            return
        }       

        LoginService.login(credentials).then((response) => {
            const data: LoginResponse = response.data
            props.setMyAccessToken(data.access_token)
            props.setMyEmail(credentials.email)
            clearHelperTexts()
            navigate("/confirm-login")
        })
        .catch((error) => {
            if(error.response.data.detail){
                setHelperTexts({loginHelperText: "", passwordHelperText: "",
                 loginResultHelperText: error.response.data.detail})
            }
        })
    }

    return(
        <Grid minWidth={"30%"}>

            <Typography textAlign={"start"} color={"#0C4359"} style={{marginTop: '50px', fontSize: 24}}>
                Email
            </Typography>

            <TextField
                style={{marginTop: '20px'}}
                id="email"
                fullWidth
                value={credentials.email}
                onChange={(event) =>
                    setCredentials({ ...credentials, email: event.target.value })
                }
                helperText={helperTexts.loginHelperText}>
            </TextField>

            <Typography  textAlign={"start"} color={"#0C4359"} style={{marginTop: '20px', fontSize: 24}}>
                Password
            </Typography>
            
            <TextField
                style={{marginTop: '20px'}}
                id="password"
                type="password"
                fullWidth
                value={credentials.password}
                onChange={(event) =>
                    setCredentials({ ...credentials, password: event.target.value })
                }
                helperText={helperTexts.passwordHelperText}>
            </TextField>

            <Button  style={{background: '#214757', fontSize: 28, width:"100%", marginTop: 40}}
                onClick={handleLogin}>
                Login
            </Button>

            <Typography width="100%" textAlign={"center"} color={"#ff0000"} style={{marginTop: '8px', fontSize: 24}}>
                {helperTexts.loginResultHelperText}
            </Typography>

        </Grid>
    )

}

export default LoginPage