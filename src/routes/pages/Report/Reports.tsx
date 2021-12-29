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
import {TaskAlt} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import ListTasks from "./ListTasks";
import {collection, query, onSnapshot, where, doc, FirestoreDataConverter} from "firebase/firestore";
import {db} from "../../../config/firebase.config";
import Report, {reportConvertor} from '../../../models/Report';
import {isEmpty} from "lodash";

const Reports = () => {

    const {user} = useAuth()
    const [expanded, setExpanded] = useState<number | false>(false);
    const navigate = useNavigate();
    const [reports, setReports] = useState<Report[]>([])

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
                                    <Typography sx={{width: '33%', flexShrink: 0}}>
                                        Hesabat
                                    </Typography>
                                    <Typography
                                        sx={{color: 'text.secondary'}}>{report.date.toDateString()}
                                    </Typography>
                                    <Button color={"primary"}>Edit</Button>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <ListTasks report_id={report.id} show_actions={false}/>
                                </AccordionDetails>
                            </Accordion>
                        )}
                    </>
                    : <Typography>Hesabat yoxdur</Typography>
                }
                <Button variant="contained" color="success" sx={{mt: 2, color: 'text.primary'}}
                        onClick={() => navigate(`/reports/#`)}>
                    Hesabat yaz
                </Button>
            </Box>
        </>
    );
};

export default Reports;
