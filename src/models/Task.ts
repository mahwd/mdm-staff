import {DocumentData, QueryDocumentSnapshot, SnapshotOptions, Timestamp} from "firebase/firestore";

export default class Task {
    id: string;
    content: string;
    is_done: boolean = false;
    report_id: string;
    date: Date

    getDateString() {
        return this.date.toDateString()
    }

    constructor(id: string, content: string, date: Date, is_done: boolean = false, report_id: string) {
        this.id = id
        this.content = content
        this.date = date
        this.is_done = is_done
        this.report_id = report_id
    }
}

export const taskConvertor = {
    toFirestore(task: Task): DocumentData {
        return {
            content: task.content,
            date: Timestamp.fromDate(task.date),
            is_done: task.is_done,
            report_id: task.report_id
        };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): Task {
        const data = snapshot.data(options)!;
        return new Task(snapshot.id, data.content, data.date.toDate(), data.is_done, data.report_id);
    }
}
