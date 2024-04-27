import { Button, Grid, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Validator from "../validators/Validator"
import RegistrationService from "../services/registerService"
import { ConfirmRegistration } from "../services/registerService"

const ConfirmRegisterPage = (props: any) => {
    const navigate = useNavigate()
    const [verificationCode, setVerificationCode] = useState<string>("")
    const[helperText, setHelperText] = useState<string>("")

    const clearPage = () => {
        setVerificationCode("")
        setHelperText("")
    }

    const handleRegistrationConfirmation = () => {
        if(!Validator.validateVerificationCode(verificationCode)){
            setHelperText(Validator.invalidVerificationCodeMessage)
            return
        }
        const values: ConfirmRegistration = {
            email: props.email,
            access_token: props.tokens.access_token,
            verification_code: verificationCode
        }
        RegistrationService.confirmRegistration(values).then((response => {
            clearPage()
            navigate("/login")
        }))
        .catch((error => {
            setHelperText(error.response.data.detail)
        }))
    }

    return(
        <Grid minWidth={"30%"}>
            <Typography textAlign={"start"} color={"#1C5685"} style={{marginTop: '50px', fontSize: 16}}>
                Verification code was sent to your email address. To confirm registration, write it below.
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
                onClick={handleRegistrationConfirmation}>
                Confirm registration
            </Button>

            <Typography width="100%" textAlign={"center"} color={"#ff0000"} style={{marginTop: '8px', fontSize: 24}}>
                {helperText}
            </Typography>

        </Grid>
    )

}

export default ConfirmRegisterPage