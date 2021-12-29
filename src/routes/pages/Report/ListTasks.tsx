import React, {FC, useEffect, useState} from "react";
import {
    Box,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    TextField,
    FormControlLabel, Checkbox, Button
} from "@mui/material";
import {TaskAlt, Delete, Edit, Done, Cancel} from "@mui/icons-material";
import {
    collection,
    deleteDoc,
    updateDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    where
} from "firebase/firestore";
import {db} from "../../../config/firebase.config";
import {useAuth} from "../../../components/Auth/AuthProvider";
import Task, {taskConvertor} from "../../../models/Task";
import {useForm} from "react-hook-form";
import {reportConvertor} from "../../../models/Report";
import {useDispatch} from "react-redux";
import {types} from "../../../redux/actions";

import TaskRow from "./TaskRow";
import {isEmpty} from "lodash";

export type TListTasksProps = {
    report_id: string;
    show_actions: Boolean
}


const ListTasks: FC<TListTasksProps> = ({report_id, show_actions}) => {

    type TState = {
        task_id: string,
        content: string,
        is_done: Boolean,
        show_inputs: Boolean
    }

    // const {user} = useAuth()
    const {register, handleSubmit, setValue, formState: {isDirty, isValid}} = useForm()
    const [tasks, setTasks] = useState<Task[]>([]);
    const tasksCollection = collection(db, "tasks")

    const reportDoc = doc(db, 'reports', report_id)

    useEffect(() => {
        if (isEmpty(report_id)) return;

        console.log("report id change ", report_id)
        const q = query(
            tasksCollection,
            where("report_id", '==', report_id),
            orderBy('date', 'desc')
        ).withConverter(taskConvertor)
        const unsub = onSnapshot(q, (snap) => {
            const tasks: Task[] = snap.docs.map(doc => doc.data())
            console.log("report tasks -> ", tasks)
            setTasks(tasks)
        });
        return () => unsub()
    }, [report_id])

    return (
        <>
            <Typography variant={"h6"} align={"center"} color={"text.primary"}>
                Görülmüş işlər
            </Typography>
            <Box sx={{
                display: 'flex',
                justifyContent: "left"
            }}>
                <List sx={{minWidth: 500}}>
                    {
                        tasks?.length ?
                            tasks.map((task, i) =>
                                <ListItem key={i}>
                                    <TaskRow task={task} report_doc={reportDoc} show_actions={show_actions}/>
                                </ListItem>)
                            : <h1>No task</h1>
                    }
                </List>
            </Box>
        </>
    );
};

export default ListTasks;
