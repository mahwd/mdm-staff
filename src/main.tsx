import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {orange} from '@mui/material/colors';
import store from './redux'
import {Provider} from "react-redux";
import {app} from "./config/firebase.config";
import {BrowserRouter, useRoutes} from "react-router-dom";
import AuthProvider from "./components/Auth/AuthProvider";


declare module '@mui/material/styles' {
    interface Theme {
        status: {
            danger: string;
        };
    }

    // allow configuration using `createTheme`
    interface ThemeOptions {
        status?: {
            danger?: string;
        };
    }
}

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: '#0090ff',
        },
        secondary: {
            main: '#67c772',
            contrastText: '#f9f8f8',
        },
        text: {
            primary: '#ffffff'
        }
    },
    status: {
        danger: orange[500],
    },
});


ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={darkTheme}>
            <Provider store={store}>
                <BrowserRouter>
                    <AuthProvider>
                        <App/>
                    </AuthProvider>
                </BrowserRouter>
            </Provider>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
)
