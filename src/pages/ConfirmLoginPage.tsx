import { Button, Grid, TextField, Typography } from "@mui/material"
import Validator from "../validators/Validator"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import LoginService, { ConfirmLogin, ConfirmLoginResponse } from "../services/loginService"




const ConfirmLoginPage = (props: any) => {
    const navigate = useNavigate()
    const [verificationCode, setVerificationCode] = useState<string>("")
    const[helperText, setHelperText] = useState<string>("")

    const clearPage = () => {
        setVerificationCode("")
        setHelperText("")
    }

    const handleLoginConfirmation = () => {
        if(!Validator.validateVerificationCode(verificationCode)){
            setHelperText(Validator.invalidVerificationCodeMessage)
            return
        }
        
        const values: ConfirmLogin = {
            email: props.email,
            access_token: props.tokens.access_token,
            verification_code: verificationCode
        }
        LoginService.confirmLogin(values).then((response => {
            const data: ConfirmLoginResponse = response.data
            props.setMyTokens(data.access_token, data.refresh_token)
            props.showMenuOnAppBar()
            clearPage()
            navigate("/messages")
        }))
        .catch((error => {
            setHelperText(error.response.data.detail)
        }))
    }



    return(
        <Grid minWidth={"30%"}>
            <Typography textAlign={"start"} color={"#1C5685"} style={{marginTop: '50px', fontSize: 16}}>
                Verification code was sent to your email address. To confirm login, write it below.
            </Typography>
            <Typography textAlign={"start"} color={"#0C4359"} style={{marginTop: '50px', fontSize: 24}}>
                VerificationCode
            </Typography>

            <TextField
                style={{marginTop: '20px'}}
                id="email"
                fullWidth
                value={verificationCode}
                onChange={(event) =>
                    setVerificationCode(event.target.value)
                }
            >
            </TextField>
            <Button  style={{background: '#214757', fontSize: 28, width:"100%", marginTop: 40}}
                onClick={handleLoginConfirmation}>
                Confirm login
            </Button>

            <Typography width="100%" textAlign={"center"} color={"#ff0000"} style={{marginTop: '8px', fontSize: 24}}>
                {helperText}
            </Typography>

        </Grid>
    )



}

export default ConfirmLoginPage