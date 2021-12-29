import {db} from '../config/firebase.config'
import {
    getDocs,
    doc,
    query,
    where,
    limit,
    orderBy,
    collection,
    DocumentData,
    QueryDocumentSnapshot,
    SnapshotOptions
} from "firebase/firestore";

export default class User {
    id: string;
    name: string;
    surname: string;
    github_username: string;
    position: string;
    last_report_id!: string;
    last_report_date!: Date;
    weekly_report: boolean = false;
    weekly_report_check: boolean = false;

    // methods

    async get_last_report() {
        const reportsCol = collection(db, 'reports')
        const q = query(
            reportsCol,
            where("user_id", "==", this.id),
            orderBy("date", "asc"),
            limit(1)
        )
        const snap = await getDocs(q)
        // this.last_report = snap.docs.map(doc => doc.data())[0] as Report
        const last_report = snap.docs.map(doc => doc.data())[0]
        if (last_report) {
            this.last_report_id = last_report.id
            this.last_report_date = last_report.date
        }
    }

    is_weekly_report_done = async () => {
        if (!this.last_report_id)
            await this.get_last_report()


        const today: Date = new Date();
        const one_jan: Date = new Date(today.getFullYear(), 0, 1);
        const number_of_days = Math.floor((today.getTime() - one_jan.getTime()) / (24 * 60 * 60 * 1000));
        const current_week_number = Math.ceil((today.getDay() + 1 + number_of_days) / 7);
        const report_week_number = this.last_report_date && Math.ceil((this.last_report_date.getDay() + 1 + number_of_days) / 7);

        this.weekly_report = current_week_number === report_week_number
    };

    public getFullName = () => `${this.name} ${this.surname}`

    get_last_report_date() {
        return new Date().toDateString()
    }

    // CTOR
    constructor(
        id: string,
        name: string,
        surname: string,
        position: string,
        github_username: string,
        last_report_id: string,
        last_report_date: Date,
        weekly_report: boolean,
        weekly_report_check: boolean
    ) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.position = position;
        this.github_username = github_username;
        // this.is_weekly_report_done().then(() => this.weekly_report_check = true);
        this.last_report_id = last_report_id;
        this.last_report_date = last_report_date;
        this.weekly_report = weekly_report;
        this.weekly_report_check = weekly_report_check;
    }

}


export const userConvertor = {
    toFirestore(user: User): DocumentData {
        return {
            name: user.name,
            surname: user.surname,
            position: user.position,
            github_username: user.github_username,
            last_report_id: user.last_report_id,
            last_report_date: user.last_report_date,
            weekly_report: user.weekly_report,
            weekly_report_check: user.weekly_report_check,
        };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): User {
        const data = snapshot.data(options)!;
        return new User(
            snapshot.id,
            data.name,
            data.surname,
            data.position,
            data.github_username,
            data.last_report_id,
            data.last_report_date.toDate(),
            data.weekly_report,
            data.weekly_report_check,
        );
    }
}
