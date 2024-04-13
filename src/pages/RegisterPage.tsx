import { Button, Grid, TextField, Typography } from "@mui/material"
import { useEffect } from "react"
import RegistrationService from "../services/registerService"




const RegisterPage = (props: any) => {


    // useEffect(() => {
    //     props.setRegAndLogStatus({
    //         blocked: true
    //     })




    // }, [])





    return(
        <Grid width={"30%"}>
            <Typography textAlign={"start"} color={"#0C4359"} style={{marginTop: '50px', fontSize: 24}}>
                Login
            </Typography>
            <TextField
                style={{marginTop: '20px'}}
              id="equation"
              fullWidth
            //   placeholder="Wpisz równanie liniowe..."
              value={"S"}
            //   onChange={(event) =>
            //     setEq({ ...eq, equation: event.target.value })
            //   }
              helperText={"A"}
            ></TextField>

            <Typography  textAlign={"start"} color={"#0C4359"} style={{marginTop: '20px', fontSize: 24}}>
                Password
            </Typography>
            <TextField
                style={{marginTop: '20px'}}
              id="equation"
              fullWidth
            //   placeholder="Wpisz równanie liniowe..."
              value={"S"}
            //   onChange={(event) =>
            //     setEq({ ...eq, equation: event.target.value })
            //   }
              helperText={"A"}
            ></TextField>

            <Button  style={{background: '#214757', fontSize: 24, width:"100%", marginTop: 40}}>
                Register
            </Button>

            <Typography width="100%" textAlign={"center"} color={"#ff0000"} style={{marginTop: '8px', fontSize: 24}}>
                Invalid username or password
            </Typography>




        </Grid>
    )



}

export default RegisterPage