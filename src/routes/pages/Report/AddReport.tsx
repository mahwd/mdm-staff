import React, {FC, useEffect, useState} from 'react';
import {useAuth} from "../../../components/Auth/AuthProvider";
import {
    Box,
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    IconButton
} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import Report, {reportConvertor} from "../../../models/Report";
import ListTasks from "./ListTasks";
import {
    collection,
    doc,
    addDoc,
    deleteDoc,
    limit,
    onSnapshot,
    query,
    where,
    setDoc, orderBy, Timestamp
} from "firebase/firestore";
import {db} from "../../../config/firebase.config";
import {Add} from "@mui/icons-material";
import {get_current_monday} from "../../../config/helpers";
import {isEmpty} from "lodash";
import Task, {taskConvertor} from "../../../models/Task";


export type TAddReport = {
    report?: Report
}

const AddReport: FC<TAddReport> = (props) => {

    const {user} = useAuth()
    const navigate = useNavigate();
    const {register, handleSubmit, formState: {errors}, reset} = useForm();
    const [report, setReport] = useState<Report>({} as Report)
    const reportsRef = collection(db, "reports").withConverter(reportConvertor);

    useEffect(() => {

        if (isEmpty(user))
            return

        const monday = get_current_monday()
        console.log("monday: ", monday)
        const q = query(
            reportsRef,
            where("user_id", '==', user.id),
            where('date', '>', Timestamp.fromDate(monday)),
            where('date', '<', Timestamp.now()),
            limit(1)
        )
        const unsubReports = onSnapshot(q, async (snap) => {
            if (snap.empty) {
                console.log("report empty")
                // report not exist
                const _report = new Report("id", new Date(), user.id);
                const docRef = await addDoc(reportsRef, _report)
                if (docRef.id) {
                    _report.id = docRef.id
                    setReport(_report)
                } else {
                    navigate(-1)
                }
            } else
                snap.forEach((queryDoc) => {
                    console.log("report exist: ", queryDoc.data().id)
                    setReport(queryDoc.data())
                })
        });
        return () => {
            unsubReports();
        }
    }, [user]);


    const submitTask = async ({content, is_done}: { content: string, is_done: boolean }) => {
        const tasksCollection = collection(db, 'tasks').withConverter(taskConvertor)
        try {
            const new_task = new Task("", content, new Date(), is_done, report.id)
            const docRef = await addDoc(tasksCollection, new_task)
            if (docRef.id) {
                new_task.id = docRef.id
                // report.tasks.push(new_task)
                setReport(report)
                await setDoc(doc(reportsRef, report.id).withConverter(reportConvertor), report)
                reset({content: ""})
            }
        } catch (e) {
            console.log(e)
        }

    };

    const reportDone = () => {
        navigate(-1)
    };

    // window.onbeforeunload = (event) => {
    //     const e = event || window.event;
    //     // Cancel the event
    //     e.preventDefault();
    //     if (e) {
    //         e.returnValue = ''; // Legacy method for cross browser support
    //     }
    //     return ''; // Legacy method for cross browser support
    // };


    return (
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} paddingTop={4}>
            <Box component="form" onSubmit={handleSubmit(submitTask)} noValidate
                 sx={{
                     p: 5,
                     backgroundColor: "background.paper",
                     width: 500
                 }}
                 display={"flex"}
                 flexDirection={"column"}
                 alignItems={"center"}>

                {!isEmpty(report) && <ListTasks report_id={report.id} show_actions={true}/>}

                <Box sx={{my: 2, display: 'flex', alignItems: 'flex-start'}}>
                    <TextField
                        margin="normal"
                        required
                        {...register("content", {
                            required: true
                        })}
                        id="content"
                        sx={{width: 250}}
                        multiline={true}
                        label="Işin məzmunu"
                        name="content"
                        color={"primary"}
                        variant={"outlined"}
                        autoComplete="content"
                        autoFocus
                        error={!!errors?.content}
                        helperText={errors?.content?.type === "required" && "Bu sahə doldurulmalıdır!"}
                    />
                    <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                        size={"large"}
                        onClick={handleSubmit(submitTask)}
                        sx={{
                            mt: 3,
                            ml: 1
                        }}
                    >
                        <Add/>
                    </IconButton>
                </Box>

                <Box justifyContent={'center'}>
                    <FormControlLabel control={<Checkbox defaultChecked {...register("is_done", {required: false})} />}
                                      sx={{color: 'text.primary'}}
                                      label="Bitib?"/>
                </Box>


                <Button variant="contained"
                        color="success"
                        sx={{mt: 2, color: 'text.primary'}}
                        onClick={reportDone}
                        startIcon={<SaveIcon/>}>
                    Yadda saxla
                </Button>
            </Box>
        </Box>
    );
};

export default AddReport;
