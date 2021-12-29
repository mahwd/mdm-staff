import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import avatar from '../../assets/images/logo_white_primary.png';
import {useForm} from "react-hook-form";
import {ILoginData} from '../../services/firebase/auth'
import {useAuth} from "../../components/Auth/AuthProvider";

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://github.com/mahwd">
                TAGHIYEVS CORPORATION
                {' ' + new Date() + '.'}
            </Link>
        </Typography>
    )
}

interface ILoginProps {}

function Login(props: ILoginProps) {

    const {register, handleSubmit, formState: {errors}} = useForm();

    const {sign_in} = useAuth()

    const onSubmit = async (data: ILoginData) => {
        try {
           if(typeof sign_in === "function") {
                const user = await sign_in(data)
                console.log("User -> ", user)
            } else {
               console.error("Something went wrong...")
           }
        } catch (errorMessage) {}
    }

    return (
        <div>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >

                    <Avatar alt="MDM" variant="rounded" src={avatar}
                            sx={{width: 80, height: 80, bgcolor: 'secondary.main'}}/>
                    <hr/>
                    <Typography component="h1" variant="h5">
                        Daxil ol
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            {...register("email", {
                                required: true,
                                pattern: /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
                            })}
                            id="email"
                            label="Email Address"
                            name="email"
                            color={"primary"}
                            autoComplete="email"
                            autoFocus
                            error={!!errors?.email}
                            helperText={errors?.email?.type === "pattern" && "Invalid Email"}
                        />
                        <TextField
                            margin="normal"
                            required
                            color={"primary"}
                            fullWidth
                            {...register("password", {required: true, minLength: 8})}
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            error={!!errors?.password}
                            helperText={errors?.password?.type === "minLength"
                                ? "Minimum password length is 8"
                                : errors?.password?.type === "required" && "Password required"}
                        />

                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary"/>}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
        </div>
    );
}

export default Login;
