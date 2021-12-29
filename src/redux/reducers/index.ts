import {types} from "../actions";
import {AlertColor} from "@mui/material";

export interface IStore {
    loading: boolean,
    snack: {
        show:boolean,
        message: string,
        severity: AlertColor
    }
}

const initial: IStore = {
    loading: true,
    snack: {
        show:false,
        message: '',
        severity: 'success'
    }
}

export default function reducer(state = initial, action: any) {

    switch (action.type) {
        case types.UPDATE_SNACK: {
            return {
                ...state,
                snack: action.payload
            }
        }
        case types.SET_LOADING: {
            return {
                ...state,
                loading: action.payload
            }
        }
        default: {
            return state
        }
    }
}
