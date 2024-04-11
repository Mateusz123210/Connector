import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import { ThemeProvider, createTheme} from "@mui/material";
import MainPage from "./pages/MainPage";

const theme = createTheme(
  {
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
        main: "#ca2f2f",
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
        paper: '#E8EEF6'
      }
    },
  },

);

function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Routes>
                  <Route path="/" element={<MainPage />} />
                  
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;

