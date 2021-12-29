import {collection, doc, getDoc} from "firebase/firestore";
import {db} from "../../../config/firebase.config";
import Report, {reportConvertor} from "../../../models/Report";

const reportsRef = collection(db, "reports")

export const getReport = async (id: string): Promise<Report> => new Promise(async (resolve, reject) => {
    const report_doc = doc(reportsRef, id).withConverter(reportConvertor)
    const reportSnap = await getDoc(report_doc);
    if (reportSnap.exists()) {
        const report = reportSnap.data()
        console.log("report -> ", report)
        resolve(report);
    } else {
        reject("No such document!");
    }
})
