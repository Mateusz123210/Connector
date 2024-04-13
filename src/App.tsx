import React from "react";
import {useState, useEffect} from "react"
import {BrowserRouter, Routes, Route} from "react-router-dom";
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

const App = () => {
  const [regAndLogStatus, setRegAndLogStatus] = React.useState<RegistrationAndLoginStatus>({
    blocked: false,
    logged: false
  })
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
              <ResponsiveAppBar logged={regAndLogStatus.logged} blocked={regAndLogStatus.blocked}  />
              <Routes>
                      <Route path="/" element={<MainPage setRegAndLogStatus={setRegAndLogStatus} />} />
                      <Route path="/register" element={<RegisterPage setRegAndLogStatus={setRegAndLogStatus} />} />
                      <Route path="/confirm-registration" element={<ConfirmRegisterPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/confirm-login" element={<ConfirmLoginPage />} />
                      <Route path="/messages" element={<MessagePage />} />
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

