import {takeEvery, spawn, put, fork, call} from 'redux-saga/effects';
import {manipulators} from '../manipulators';

function* UpdateSnack(action: any) {
    yield put({type: manipulators.UPDATE_SNACK_MAN, payload: action?.payload});
}

export function* WatchSnackSaga() {
    yield takeEvery(manipulators.UPDATE_SNACK_MAN, UpdateSnack)
}

function* SetLoading(action: any) {
    yield put({type: manipulators.SET_LOADING_MAN, payload: action?.payload});
}

export function* WatchLoadingSaga() {
    yield takeEvery(manipulators.SET_LOADING_MAN, SetLoading)
}



export default function* rootSaga() {
    console.log("rootSaga")
    yield call(WatchSnackSaga)
    yield call(WatchLoadingSaga)
}
