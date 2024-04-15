import { Button, Grid, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import RegistrationService, { RegisterResponse } from "../services/registerService"
import { Register } from "../services/registerService"
import Validator from "../validators/Validator"
import {useNavigate } from "react-router-dom"

export interface HelperTexts{
    loginHelperText: string,
    passwordHelperText: string,
    registrationResultHelperText: string
}


const RegisterPage = (props: any) => {
    const navigate = useNavigate();

    const[credentials, setCredentials] = useState<Register>({
        email: "",
        password: ""
    })

    const[secondPassword, setSecondPassword] = useState<string>("")

    const[helperTexts, setHelperTexts] = useState<HelperTexts>({
        loginHelperText: "",
        passwordHelperText: "",
        registrationResultHelperText: ""
    })

    const clearHelperTexts = () => {
        setHelperTexts({
            loginHelperText: "",
            passwordHelperText: "",
            registrationResultHelperText: ""
        })
    }

    const handleRegister = () => {
        var success = true
        var email_error = ""
        var password_error = ""
        if(!Validator.validateEmail(credentials.email)){
            console.log("invalid")
            email_error = Validator.invalidEmailMessage
            success = false
        }
        if(!Validator.validatePassword(credentials.password)){
            success = false
            password_error = Validator.invalidPasswordMessage
        }else if(credentials.password !== secondPassword){
            success = false
            password_error = "Passwords are not the same"
        }
        if(success === false){
            setHelperTexts({loginHelperText: email_error, passwordHelperText: password_error, registrationResultHelperText: ""})
            return
        }       

        RegistrationService.register(credentials).then((response) => {
            const data: RegisterResponse = response.data
            props.setMyAccessToken(data.access_token)
            props.setMyEmail(credentials.email)
            clearHelperTexts()
            navigate("/confirm-registration")
        })
        .catch((error) => {
            if(error.response.data.detail){
                setHelperTexts({loginHelperText: "", passwordHelperText: "",
                 registrationResultHelperText: error.response.data.detail})
            }
        })
    }


    useEffect(() => {
        clearHelperTexts()
        // props.setRegAndLogStatus({
        //     blocked: true
        // })




    }, [])






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
                }>
            </TextField>

            <Typography  textAlign={"start"} color={"#0C4359"} style={{marginTop: '20px', fontSize: 24}}>
                Confirm password
            </Typography>

            <TextField
                style={{marginTop: '20px'}}
                id="password2"
                type="password"
                fullWidth
                value={secondPassword}
                onChange={(event) =>
                    setSecondPassword(event.target.value)
                }
                helperText={helperTexts.passwordHelperText}>
            </TextField>

            <Button  style={{background: '#214757', fontSize: 28, width:"100%", marginTop: 40}}
                onClick={handleRegister}>
                Register
            </Button>

            <Typography width="100%" textAlign={"center"} color={"#ff0000"} style={{marginTop: '8px', fontSize: 24}}>
                {helperTexts.registrationResultHelperText}
            </Typography>

        </Grid>
    )
}

export default RegisterPage