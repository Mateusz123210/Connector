import { Grid, Typography } from "@mui/material"

const MainPage = (props: any) => {

    return(
        
        <Grid item width={"50%"}  marginTop={15} >
            <Typography variant="h1" textAlign={"center"} color={"#0C4359"}>
                Welcome! To start, login or create account.
            </Typography>
        </Grid>
    )

}

export default MainPage