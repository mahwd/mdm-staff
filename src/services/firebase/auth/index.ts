import {getAuth, signInWithEmailAndPassword, signOut, UserCredential} from "firebase/auth";

export interface ILoginData {
    email: string,
    password: string
}

export const SignIn = async (data: ILoginData):Promise<UserCredential> => {
    return new Promise((resolve, reject) => {
        try {
            const auth = getAuth();
            signInWithEmailAndPassword(auth, data.email, data.password)
                .then((userCredential: UserCredential) => {
                    // Signed in
                    resolve(userCredential)
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    reject(errorMessage)
                });
        } catch (e) {
            reject(e)
        }
    })
}

export const SignOut = async () => {
    return new Promise((resolve, reject) => {
        try {
            const auth = getAuth();
            signOut(auth).then((res) => {
                console.log(res)
                resolve({})
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                reject(errorMessage)
            });
        } catch (e) {
            reject(e)
        }
    })
}
