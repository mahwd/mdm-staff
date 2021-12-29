import React from 'react';
import {AppBar, Toolbar, Typography} from '@mui/material';

interface IFooterProps {

}


const Footer = (props: IFooterProps) => {
    return (
        <>
            <AppBar position="sticky" color="primary" sx={{ top: 'auto', bottom: 0, marginTop: '64px' }} enableColorOnDark>
                <Toolbar sx={{display: 'flex', justifyContent: 'center'}}>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{mr: 2, display: {xs: 'none', md: 'flex' }}}
                    >
                        National Depository Center
                    </Typography>
                </Toolbar>
            </AppBar>
        </>
    );
}

export default Footer;
