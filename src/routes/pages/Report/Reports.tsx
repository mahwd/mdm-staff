import React, {useEffect, useState} from 'react';
import {useAuth} from "../../../components/Auth/AuthProvider";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Typography
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import {useNavigate} from "react-router-dom";
import ListTasks from "./ListTasks";
import {
    collection,
    query,
    onSnapshot,
    where,
    doc,
    FirestoreDataConverter,
    addDoc,
    Timestamp,
    limit, getDoc, getDocs
} from "firebase/firestore";
import {db} from "../../../config/firebase.config";
import Report, {reportConvertor} from '../../../models/Report';
import {isEmpty} from "lodash";
import {get_current_monday} from "../../../config/helpers";
import {types} from "../../../redux/actions";
import {useDispatch} from "react-redux";

const Reports = () => {

    const {user} = useAuth()
    const Dispatch = useDispatch()
    const [expanded, setExpanded] = useState<number | false>(false);
    const navigate = useNavigate();
    const [reports, setReports] = useState<Report[]>([])
    const reportsRef = collection(db, 'reports').withConverter(reportConvertor)

    const handleChange = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    useEffect(() => {

        if (isEmpty(user))
            return;

        const q = query(collection(db, "reports"), where("user_id", '==', user.id)).withConverter(reportConvertor)
        const unsub = onSnapshot(q, (snap) => {
            const _reports: Report[] = snap.docs.map((doc) => doc.data())
            console.log("reports: ", _reports)
            setReports(_reports)
        });
        return () => unsub()

    }, [user]);

    const isEditable = (date: Date) => {
        const monday = get_current_monday()
        const diffTime = Math.abs(date.getTime() - monday.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 7
    }

    const AddReport = async () => {
        // report not exist
        const monday = get_current_monday()
        console.log("monday: ", monday)
        const q = query(
            reportsRef,
            where("user_id", '==', user.id),
            where('date', '>', Timestamp.fromDate(monday)),
            where('date', '<', Timestamp.now()),
            limit(1)
        )
        getDocs(q).then(async (snap) => {
            if (snap.empty) {
                console.log("report empty")
                //        report not exist
                const _report = new Report("id", new Date(), user.id);
                const docRef = await addDoc(reportsRef, _report)
                if (docRef.id) {
                    navigate(`/reports/${docRef.id}`)
                } else {
                    window.location.reload()
                    // navigate(-1)
                }
            } else {
                Dispatch({
                    type: types.UPDATE_SNACK,
                    payload: {
                        show: true,
                        message: 'Report for current week already exist!',
                        severity: 'error',
                    }
                })
            }
        });
    }
    return (
        <>
            <Box sx={{p: 5}}>
                {reports?.length
                    ? <>
                        {reports.map((report, index) =>
                            <Accordion expanded={expanded === index} onChange={handleChange(index)} key={index}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon/>}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center"
                                    }}
                                >
                                    <table width={"100%"}>
                                        <tbody>
                                        <tr>
                                            <td>
                                                <Typography sx={{width: '33%', flexShrink: 0}}>
                                                    Hesabat
                                                </Typography>
                                            </td>
                                            <td>
                                                <Typography sx={{color: 'text.secondary'}}>
                                                    {report.date.toDateString()}
                                                </Typography>
                                            </td>
                                            <td>
                                                <Button color={"secondary"}
                                                        disabled={isEditable(report.date)}
                                                        variant={"contained"}
                                                        startIcon={<EditRoundedIcon/>}
                                                        onClick={() => navigate(`/reports/${report.id}`)}
                                                >
                                                    Edit
                                                </Button>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <ListTasks report_id={report.id} show_actions={false}/>
                                </AccordionDetails>
                            </Accordion>
                        )}
                    </>
                    : <Typography>Hesabat yoxdur</Typography>
                }
                <Button variant="contained" color="success"
                        sx={{mt: 2, color: 'text.primary', textTransform: 'uppercase'}}
                        onClick={AddReport}>
                    Add Report
                </Button>
            </Box>
        </>
    );
};

export default Reports;
