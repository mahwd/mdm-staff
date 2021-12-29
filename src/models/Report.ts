import {
    DocumentData,
    QueryDocumentSnapshot,
    SnapshotOptions,
    Timestamp,
    DocumentReference,
    doc
} from 'firebase/firestore'
import {db} from '../config/firebase.config';
import Task from './Task'

export default class Report {

    id: string;
    date: Date;
    user_id: string

    constructor(id: string, date: Date, user_id: string) {
        this.id = id;
        this.user_id = user_id;
        this.date = date;
    }
}


export const reportConvertor = {
    toFirestore(report: Report): DocumentData {
        return {
            date: report.date,
            user_id: report.user_id
        };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): Report {
        const data = snapshot.data(options)!;
        return new Report(snapshot.id, data.date.toDate(), data.user_id);
    }
}
