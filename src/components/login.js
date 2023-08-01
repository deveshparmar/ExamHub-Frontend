import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ResponsiveAppBar from './AppBar';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="#">
                Examhub
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function LoginPage() {
    const navigate = useNavigate();
    const host = "http://localhost:8080";

    const [data, setData] = useState({
        username: "",
        password: "",
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("warning")

    const handleSnackbarOpen = (message,severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (
            data.username === "" ||
            data.password === ""
        ) {
            handleSnackbarOpen("Please fill all the fields","error");
            return;
        }
        try {
            const response = await fetch(host + "/generate-token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: data.username,
                    password: data.password,
                }),
            });

            if (response.status === 200) {
                const data = await response.json();
                const token = data.token;
                localStorage.setItem('token', token);
                console.log(token);

                const resp = await fetch(host+"/current-user",{
                    method: 'GET',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization' : "Bearer "+token,
                    },
                });

                if(resp.status===200){
                    const user = await resp.json();
                    console.log(user.phone);
                    localStorage.setItem("user",JSON.stringify(user));
                    console.log(localStorage.getItem("user"));
                    const authorities = user.authorities;
                    console.log(authorities);
                    console.log(authorities[0]);
                    if(authorities.length>0 && authorities[0].authority==="NORMAL" ){
                        handleSnackbarOpen(" User Login Successfull","success")
                        navigate("/user-dashboard/all");
                    }else if(authorities.length>0 && authorities[0].authority==="ADMIN"){
                        handleSnackbarOpen(" Admin Login Successfull","success")
                        navigate("/admin");
                    }else{
                        localStorage.removeItem('user');
                        handleSnackbarOpen("Unknown user redirecting to register page","error");
                        navigate("/register");
                    }
                    // const cuser = JSON.parse(localStorage.getItem("user"));
                }
            } else {
                handleSnackbarOpen("Invalid Details No user found!","error");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (event) => {
        setData({
            ...data,
            [event.target.name]: event.target.value,
        });
    };

    return (
        <>
            <ThemeProvider theme={defaultTheme}>
                <Grid container component="main" sx={{ height: '100vh' }}>
                    <CssBaseline />
                    <Grid
                        item
                        xs={false}
                        sm={4}
                        md={7}
                        sx={{
                            backgroundImage: 'url(https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)',
                            backgroundColor: (t) =>
                                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                        <Box
                            sx={{
                                my: 4,
                                mx: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Typography component="h1" variant="h4">
                                Login
                            </Typography>
                            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    onChange={handleChange}
                                    autoFocus
                                />
                                {/* <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                onChange={handleChange}
                                autoFocus
                            /> */}
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    onChange={handleChange}
                                    id="password"
                                    autoComplete="current-password"
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Login
                                </Button>
                                <Snackbar
                                    open={snackbarOpen}
                                    autoHideDuration={6000}
                                    onClose={handleSnackbarClose}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                >
                                    <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
                                </Snackbar>
                                <Grid container>
                                    <Grid item xs>
                                        <Link href="#" variant="body2">
                                            Forgot password?
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link href="/register" variant="body2">
                                            {"Don't have an account? Register"}
                                        </Link>
                                    </Grid>
                                </Grid>
                                <Copyright sx={{ mt: 5 }} />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </ThemeProvider>
        </>
    );
}