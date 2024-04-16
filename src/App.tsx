import React from "react";
import {useState, useEffect} from "react"
import {BrowserRouter, Routes, Route, useNavigate} from "react-router-dom";
import { ThemeProvider, createTheme, Grid} from "@mui/material";
import MainPage from "./pages/MainPage";
import MessagePage from "./pages/MessagePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ConfirmRegisterPage from "./pages/ConfirmRegisterPage";
import ConfirmLoginPage from "./pages/ConfirmLoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ResponsiveAppBar from "./pages/ResponsiveAppBar";
import ForbiddenPage from "./pages/ForbiddenPage";
import LoginService, { Logout } from "./services/loginService"
import refreshTokenService, { RefreshToken } from "./services/refreshTokenService";

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
};

const theme = createTheme(
  {
    components: {
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            color: "red",
          },
        },
      },
    },
    typography: {
      fontFamily: "Source Sans Pro, sans-serif",
      fontSize: 13,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      button: {
        textTransform: "none",
      },
    },
    palette: {
      primary: {
        main: "#2F84CA",
        contrastText: "#000",
      },
      secondary: {
        main: "#D9D9D9",
        contrastText: "#000",
      },
      info: {
        main: "#008080",
        contrastText: "#fff",
      },
      background: {
        paper: '#FFFFFF'
      }
    },
  },

);

export interface RegistrationAndLoginStatus {
  blocked: boolean,
  logged: boolean
}

export interface TokensValues {
  access_token: string,
  refresh_token: string
}

const App = () => {

  const [regAndLogStatus, setRegAndLogStatus] = React.useState<RegistrationAndLoginStatus>({
    blocked: false,
    logged: false
  })
  const [tokens, setTokens] = React.useState<TokensValues>({
    access_token: "",
    refresh_token: ""
  })
  const [email, setEmail] = React.useState<string>("")


  const setMyTokens = (acc_token: string, ref_token: string) => {
    setTokens({access_token: acc_token, refresh_token: ref_token})
    
  }

  const setMyAccessToken = (acc_token: string) => {
    setTokens({...tokens, access_token: acc_token})
  }

  const setMyEmail = (email: string) => {
    setEmail(email)
  }

  const showMenuOnAppBar = () => {
    setRegAndLogStatus({...regAndLogStatus, logged: true})
  }

  const hideMenuOnAppBar = () => {
    setRegAndLogStatus({...regAndLogStatus, logged: false})
  }

  const logout = () => {
    const values: Logout = {
      email: email,
      access_token: tokens.access_token,
    }

    const refreshTokenValues: RefreshToken = {
      email: email,
      refresh_token: tokens.refresh_token,
    }

    LoginService.logout(values).then((response) => {
      setMyTokens("", "")
      setMyEmail("")
      hideMenuOnAppBar()
      
      return true
    })
    .catch((error) => {
      
      refreshTokenService.getNewToken(refreshTokenValues).then((response) => {
        const data = response.data
        values.access_token = data.access_token

        LoginService.logout(values).then((response) => {
          console.log("C")
          setMyTokens("", "")
          setMyEmail("")
          hideMenuOnAppBar()

          return true
        })
        .catch((error) => {
    
        })
      })
      .catch((error) => {
  
      })
    })

    return false
  }



  let a = useWindowDimensions();
  return (
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Grid container
              // width={a.width}
              // justifyContent="center"
              justifyContent="center"
            >
              <ResponsiveAppBar logged={regAndLogStatus.logged} blocked={regAndLogStatus.blocked} logout={logout}  />
              <Routes>
                      <Route path="/" element={<MainPage regAndLogStatus ={regAndLogStatus} setRegAndLogStatus={setRegAndLogStatus} 
                        tokens={tokens} setTokens={setTokens} />} />
                      <Route path="/register" element={<RegisterPage setMyAccessToken={setMyAccessToken} setMyEmail={setMyEmail} />} />
                      <Route path="/confirm-registration" element={<ConfirmRegisterPage tokens={tokens} email={email}/>} />
                      <Route path="/login" element={<LoginPage setMyAccessToken={setMyAccessToken} setMyEmail={setMyEmail} />} />
                      <Route path="/confirm-login" element={<ConfirmLoginPage tokens={tokens} email={email} 
                        setMyTokens={setMyTokens} showMenuOnAppBar={showMenuOnAppBar} />} />
                      <Route path="/messages" element={<MessagePage email={email} 
                        tokens={tokens} setTokens={setTokens} />} />
                      <Route path="/forbidden" element={<ForbiddenPage />} />
                      <Route path="/*" element={<NotFoundPage />} />
                      
              </Routes>
            
          </Grid>
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;

