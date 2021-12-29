import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {SignIn, ILoginData, SignOut} from "../../services/firebase/auth";
import {getUserData} from "../../services/firebase/db/User";
import {types} from "../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import User from "../../models/User";
import {isEmpty} from "lodash";
import {Backdrop, CircularProgress} from "@mui/material";
import {getAuth} from "firebase/auth";
import {IStore} from "../../redux/reducers";

type AuthContextType = {
    user: User;
    sign_in: (user: ILoginData) => Promise<User>;
    sign_out: () => Promise<{ success: Boolean }>;
    set_user: (user: User) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export default function AuthProvider({children}: { children: ReactNode }) {
    const [user, setUser] = useState<User>({} as User);
    const Dispatch = useDispatch()
    const auth = getAuth()
    const navigate = useNavigate()
    const loading = useSelector((state: IStore) => state.loading)


    const set_user = (user?: User) => {
        setUser(user || {} as User);
    }

    const sign_in = (loginData: ILoginData): Promise<User> => new Promise(async (resolve, reject) => {
        try {
            Dispatch({
                type: types.SET_LOADING,
                payload: true
            })
            const user_credential = await SignIn(loginData)
            const user = await getUserData(user_credential.user.uid) as User
            resolve(user);
            Dispatch({
                type: types.SET_LOADING,
                payload: false
            })
            set_user(user)
            Dispatch({
                type: types.UPDATE_SNACK,
                payload: {
                    show: true,
                    message: 'Login successful',
                    severity: 'success',
                }
            })
            navigate("")
        } catch (error: any) {
            console.log("error -> ", error)
            Dispatch({
                type: types.SET_LOADING,
                payload: false
            })
            Dispatch({
                type: types.UPDATE_SNACK,
                payload: {
                    show: true,
                    message: error?.errorMessage,
                    severity: 'error',
                }
            })
            reject(false)
            // {errorCode, errorMessage}
        }
    });

    const sign_out = (): Promise<{ success: Boolean }> => new Promise(async (resolve, reject) => {
        try {
            Dispatch({
                type: types.SET_LOADING,
                payload: true
            })
            await SignOut()
            set_user(undefined)
            Dispatch({
                type: types.SET_LOADING,
                payload: false
            })
            resolve({success: true})
        } catch ({errorCode, errorMessage}) {
            Dispatch({
                type: types.UPDATE_SNACK,
                payload: {
                    show: true,
                    message: errorMessage,
                    severity: 'error',
                }
            })
            Dispatch({
                type: types.SET_LOADING,
                payload: false
            })
            reject({errorCode, errorMessage})
        }

    })

    const _value = {user, sign_in, sign_out, set_user};

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            Dispatch({type: types.SET_LOADING, payload: false})
            if (user) {
                // set_user && set_user(user)
                const user_data: User = await getUserData(user.uid)
                set_user(user_data)
            } else {
                return navigate("/login")
            }
            return () => {
                unsubscribe()
            }
        })
    }, [])

    return (
        <AuthContext.Provider value={_value}>
            {isEmpty(user) && loading ? <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={true}
            >
                <CircularProgress color="inherit"/>
            </Backdrop> : children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
