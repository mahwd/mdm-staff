import React, {FC, useEffect, useState} from 'react';
import Task, {taskConvertor} from "../../../models/Task";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    ListItemIcon,
    ListItemText,
    TextField,
    Typography
} from "@mui/material";
import {Delete, Edit, TaskAlt} from "@mui/icons-material";
import {useForm} from "react-hook-form";
import {collection, deleteDoc, doc, setDoc, DocumentReference} from "firebase/firestore";
import {db} from "../../../config/firebase.config";
import {types} from "../../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import SwitchController from "../../../components/form-components/SwitchController";
import {IStore} from "../../../redux/reducers";

export type TaskRowProps = {
    task: Task,
    report_doc: DocumentReference
    show_actions: Boolean
}

const TaskRow: FC<TaskRowProps> = ({task, report_doc, show_actions}) => {

    interface FieldValues {
        content: string,
        is_done: boolean
    }

    const {register, handleSubmit, setValue, reset, formState: {isDirty, isValid}, control} = useForm<FieldValues>({
        defaultValues: {
            content: "string",
            is_done: false
        }
    })

    const tasksCollection = collection(db, "tasks")

    const Dispatch = useDispatch()

    const loading = useSelector((state: IStore) => state.loading)

    const deleteTask = (task: Task) => {
        // TODO Remove task_ref from report.tasks
        // const deleteReportTask = updateDoc(report_doc.withConverter(reportConvertor), {tasks: tasks.filter(_task => _task.id !== task.id)})

        const deleteTask = deleteDoc(doc(tasksCollection, task.id).withConverter(taskConvertor))
        Promise.all([
            // deleteReportTask,
            deleteTask
        ]).then(() => {
            Dispatch({
                type: types.UPDATE_SNACK,
                payload: {
                    show: true,
                    message: "Task removed",
                    severity: 'success',
                }
            })
        })
    }

    const handleEdit = (task: Task) => {
        console.log("task -> ", task)
        setOpen(true);
        setValue("content", task.content)
        setValue("is_done", task.is_done)
    }

    const cancelEdit = () => {
        setOpen(false);
    }

    const completeEdit = async (editData: FieldValues) => {
        console.log("data: ", editData)
        if (isDirty && isValid) {
            Dispatch({type: "SET_LOADING", payload: true})
            handleClose()
            if (task) {
                task.content = editData.content
                task.is_done = editData.is_done
                task.date = new Date()
                await setDoc(doc(tasksCollection, task.id).withConverter(taskConvertor), task)
                Dispatch({type: "SET_LOADING", payload: false})
            }
        }
    }

    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    // useEffect(() => {
    //     register('content', {
    //         validate: (value) => value.length || 'This is required.',
    //     });
    //     register('is_done', {
    //         validate: (value) => value.length || 'This is required.',
    //     });
    // }, [register]);


    // @ts-ignore
    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{textAlign: 'center'}}>Edit Task</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(completeEdit)}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 3
                        }}>

                            <TextField {...register("content")} name={"content"}/>

                            {/*<FormControlLabel control={*/}
                            {/*    <Controller render={({field}) => (*/}
                            {/*        <Checkbox {...field} color={"secondary"} {...register("is_done")} />*/}
                            {/*    )} control={control} name="is_done"/>*/}
                            {/*} label={"Bitib?"}/>*/}

                            <SwitchController
                                control={control}
                                name="is_done"
                                label="Bitib"/>

                        </Box>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelEdit}>Cancel</Button>
                    <Button type={"submit"} disabled={loading} onClick={handleSubmit(completeEdit)}>Submit</Button>
                </DialogActions>
            </Dialog>
            <ListItemIcon>
                <TaskAlt color={task.is_done ? "success" : "warning"}/>
            </ListItemIcon>
            <ListItemText
                primary={task.content}
                secondary={
                    <React.Fragment>
                        <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            sx={{display: 'inline'}}
                        >
                            {task.getDateString()} -
                        </Typography>
                        {task.is_done ? " Tapşırıq tamamlanmışdır." : " Tapşırıq üzərində iş gedir."}
                    </React.Fragment>
                }
                sx={{color: "text.primary"}}
            />
            {
                show_actions ?
                    <ListItemIcon>
                        <IconButton onClick={() => handleEdit(task)}>
                            <Edit/>
                        </IconButton>
                        <IconButton onClick={() => deleteTask(task)}>
                            <Delete/>
                        </IconButton>
                    </ListItemIcon>
                    : <></>
            }
        </>
    );
}

export default TaskRow;
