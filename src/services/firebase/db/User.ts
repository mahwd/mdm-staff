import {collection, doc, setDoc, getFirestore, getDoc} from "firebase/firestore";
import {db} from "../../../config/firebase.config";
import User, {userConvertor} from "../../../models/User";

const usersRef = collection(db, "users")

export const getUserData = async (id: string): Promise<User> => new Promise(async (resolve, reject) => {
    const user_doc = doc(usersRef, id).withConverter(userConvertor)
    const docSnap = await getDoc(user_doc);
    if (docSnap.exists()) {
    const user = docSnap.data()
        resolve(user);
    } else {
        reject("No such document!");
    }
})
