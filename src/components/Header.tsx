import React from 'react';
import {AppBar, Divider, IconButton, ListItemIcon, Menu, MenuItem, Toolbar, Typography} from '@mui/material';
import {useAuth} from "./Auth/AuthProvider";
import {AccountCircle} from "@mui/icons-material";
import {Link, useNavigate} from "react-router-dom";
import logo from '../assets/images/logo_white_primary.png'
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import {types} from "../redux/actions";
import {useDispatch} from "react-redux";
import {isEmpty} from 'lodash'

interface IHeaderProps {

}


const Header = (props: IHeaderProps) => {

    const {user, sign_out} = useAuth();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate()
    const Dispatch = useDispatch()

    const Logout = async () => {
        handleClose()
        const res = await sign_out();
        if (res.success) {
            return navigate("/login")
        }
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfile = () => {
        Dispatch({
            type: types.UPDATE_SNACK,
            payload: {
                show: true,
                message: "Tezliklə :)",
                severity: 'warning',
            }
        })
        handleClose()
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <AppBar position="static" enableColorOnDark color={"primary"}>
                <Toolbar>
                    <Link to="/">
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{mr: 2, display: {xs: 'none', md: 'flex'}}}
                        >
                            <Avatar src={logo} variant={"rounded"}/>
                        </Typography>
                    </Link>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        MDM IT DEPARTMENT
                    </Typography>
                    {!isEmpty(user) && (
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Typography variant="h6"
                                        component="div"
                                        sx={{display: "inline-block", padding: '12px'}}>
                                {user.getFullName()}
                            </Typography>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                {user.github_username ? <Avatar src={`https://github.com/${user.github_username}.png`}/> : <AccountCircle/>}
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleProfile}>
                                    <Avatar variant={"rounded"} sx={{
                                        marginRight: '20px',
                                        width: 20,
                                        height: 20
                                    }}/>
                                    Profile
                                </MenuItem>
                                <Divider/>
                                <MenuItem onClick={Logout}>
                                    <ListItemIcon>
                                        <LogoutIcon fontSize="small"/>
                                    </ListItemIcon>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </>
    );
}

export default Header;
