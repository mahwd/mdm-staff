import React, {FC, useEffect, useState} from 'react';
import {useAuth} from "../../../components/Auth/AuthProvider";
import {
    Box,
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import {useNavigate, useParams} from "react-router-dom";
import {useForm} from "react-hook-form";
import Report, {reportConvertor} from "../../../models/Report";
import ListTasks from "./ListTasks";
import {
    collection,
    doc,
    addDoc,
    onSnapshot,
    setDoc,
} from "firebase/firestore";
import {db} from "../../../config/firebase.config";
import {Add} from "@mui/icons-material";
import {isEmpty} from "lodash";
import Task, {taskConvertor} from "../../../models/Task";
import reports from "./Reports";
import {useDispatch} from "react-redux";


export type TAddReport = {
    report?: Report
}

const ReportDetail: FC<TAddReport> = (props) => {

    const {user} = useAuth()
    const navigate = useNavigate()
    const params = useParams()
    const {register, handleSubmit, formState: {errors}, reset} = useForm()
    const [report, setReport] = useState<Report>({} as Report)
    const reportsRef = collection(db, "reports")
    const [open, setOpen] = useState(false)
    const Dispatch = useDispatch()


    useEffect(() => {
        if (isEmpty(user))
            return

        const report_id = params.report_id

        const unsubscribe = onSnapshot(doc(reportsRef, report_id).withConverter(reportConvertor), async (snap) => {
            if (!snap.exists()) {
                console.log("report empty")
                navigate(-1)
            } else {
                setReport(snap.data())
            }
        })
        return () => {
            unsubscribe()
        }
    }, [user]);


    const submitTask = async ({content, is_done}: { content: string, is_done: boolean }) => {
        const tasksCollection = collection(db, 'tasks').withConverter(taskConvertor)
        handleClose()
        try {
            const new_task = new Task("", content, new Date(), is_done, report.id)
            const docRef = await addDoc(tasksCollection, new_task)
            if (docRef.id) {
                new_task.id = docRef.id
                setReport(report)
                await setDoc(doc(reportsRef, report.id).withConverter(reportConvertor), report)
                reset({content: ""})
            }
        } catch (e) {
            console.log(e)
        }

    };

    const Done = () => {
        navigate(-1)
    };

    const AddTask = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const cancelAdd = () => {
        reset({})
        setOpen(false)
    }

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

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle sx={{textAlign: 'center'}}>ADD Task</DialogTitle>
                    <DialogContent>
                        <form onSubmit={handleSubmit(submitTask)}>
                            <Box sx={{my: 2, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
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

                                <FormControlLabel
                                    control={<Checkbox defaultChecked {...register("is_done", {required: false})} />}
                                    sx={{color: 'text.primary'}}
                                    label="Done ?"/>
                            </Box>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={cancelAdd}>Cancel</Button>
                        <Button type={"submit"} onClick={handleSubmit(submitTask)}>Submit</Button>
                    </DialogActions>
                </Dialog>


                <Box display={"flex"} justifyContent={"center"} gap={2}>
                    <Button variant="contained"
                            color="success"
                            sx={{mt: 2, color: 'text.primary'}}
                            onClick={AddTask}
                            startIcon={<Add/>}>
                        ADD TASK
                    </Button>
                    <Button variant="contained"
                            color="success"
                            sx={{mt: 2, color: 'text.primary'}}
                            onClick={Done}
                            startIcon={<SaveIcon/>}>
                        DONE
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ReportDetail;
