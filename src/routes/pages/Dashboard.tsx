import React, {FC} from 'react';
import {useAuth} from '../../components/Auth/AuthProvider'
import {
    Button,
    Card, CardActions,
    CardContent,
    Grid,
    Paper,
    styled,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography
} from "@mui/material";
import {isEmpty} from "lodash";
import {Link} from 'react-router-dom';


export interface IDashboardProps {

}

const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body1,
    padding: theme.spacing(1),
    textAlign: 'center',
    height: '100%',
    color: theme.palette.text.secondary,
}));


type TOperation = {
    id: number,
    title: string,
    last_date?: string
}

const OperationTile: FC<TOperation> = (props) => {

    return (
        <>
            <Card sx={{width: 300, backgroundColor: "primary.main"}}>
                <CardContent>
                    <Typography variant={"h6"} color="text.secondary" gutterBottom>
                        {props.title}
                    </Typography>
                    <Typography variant="body2">Last report date: {props.last_date}</Typography>
                </CardContent>
                <CardActions sx={{alignItems: "center", justifyContent: "center"}}>
                    <Link to={"reports"} style={{textDecoration: "none"}}>
                        <Button size={"medium"} variant={"contained"} fullWidth color={"secondary"}>Go</Button>
                    </Link>
                </CardActions>
            </Card>

        </>
    )
}

const Dashboard = (props: IDashboardProps) => {
    const {user} = useAuth()

    const coming_soon_text = "Tezliklə";
    user && console.log("user-> ", user)
    return (
        <>
            <Grid container
                  columns={{xs: 12, md: 12}}
                  rowSpacing={4}
                  columnSpacing={4}
                  direction={{md: "row", xs: "column"}}
                  sx={{padding: '20px'}}>
                <Grid item md={4} xs={12}>
                    <Item>
                        <Typography variant={"h4"} component={"div"}>
                            Məlumatlar
                        </Typography>
                        {!isEmpty(user) &&
                            <Table sx={{maxWidth: 500}} aria-label="simple table">
                                <TableBody>
                                    <TableRow
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        <TableCell component="th" scope="row" align="center">Ad, Soyad</TableCell>
                                        <TableCell align="center">{user.getFullName()}</TableCell>
                                    </TableRow>
                                    <TableRow
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        <TableCell component="th" scope="row" align="center">Vəzifə</TableCell>
                                        <TableCell align="center">{user.position}</TableCell>
                                    </TableRow>
                                    <TableRow
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        <TableCell component="th" scope="row" align="center">Hesabat
                                            göndərilib</TableCell>
                                        <TableCell
                                            align="center">{user.weekly_report ? 'Bəli' : 'Xeyr'}</TableCell>
                                    </TableRow>
                                    <TableRow
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        <TableCell component="th" scope="row" align="center">Aylıq fond
                                            ödənişi</TableCell>
                                        <TableCell
                                            align="center">{coming_soon_text}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>}
                    </Item>
                </Grid>
                <Grid item md={8} xs={12}>
                    {
                        !isEmpty(user) &&
                        <Item>
                            <OperationTile title={"Reports"} id={0} last_date={user.last_report_date?.toDateString()}/>
                        </Item>
                    }
                </Grid>
                <Grid item md={4} xs={12}>
                    <Item>{coming_soon_text}</Item>
                </Grid>
                <Grid item md={4} xs={12}>
                    <Item>{coming_soon_text}</Item>
                </Grid>
                <Grid item md={4} xs={12}>
                    <Item>{coming_soon_text}</Item>
                </Grid>
            </Grid>
        </>
    );
};

export default Dashboard;
