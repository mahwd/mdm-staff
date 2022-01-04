import React, {useEffect} from 'react'
import './App.css'
import {useDispatch, useSelector} from "react-redux";
import {IStore} from "./redux/reducers";
import {Alert, Box, CircularProgress, Slide, Snackbar} from "@mui/material";
import {types} from './redux/actions';
import MainNavigation from "./routes";
import AuthProvider, {useAuth} from "./components/Auth/AuthProvider";
import User from "./models/User";
import {getUserData} from "./services/firebase/db/User";
import {getAuth} from "firebase/auth";
import {useNavigate} from "react-router-dom";

function TransitionUp(props: any) {
    return <Slide {...props} direction="up"/>;
}

function App() {

    const snack = useSelector((state: IStore) => state.snack)
    const loading = useSelector((state: IStore) => state.loading)
    const Dispatch = useDispatch()
    const auth = getAuth()
    const {set_user} = useAuth()
    const navigate = useNavigate()

    const handleClose = () => {
        Dispatch({
            type: types.UPDATE_SNACK,
            payload: {
                show: false,
                severity: snack.severity || ""
            }
        })
    }

    return (
        <div className="App">
            <Snackbar
                open={snack.show}
                autoHideDuration={6000}
                anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                onClose={handleClose}
                TransitionComponent={TransitionUp}>
                <Alert onClose={handleClose} severity={snack.severity} sx={{width: '100%'}}>
                    {snack.message}
                </Alert>
            </Snackbar>
            <MainNavigation/>
        </div>
    )
}

export default App
