import { FC, FormEvent, useContext, useEffect, useState } from 'react';
import { Box, Button, Container, FormControlLabel, FormGroup, Grid, TextField, Typography } from '@mui/material';
import { IDepartment, IUser } from "components/interfaces";
import { UserContext } from 'pages/_app';
import { useRouter } from 'next/router';
import CustomAlert from 'components/form-fields/CustomAlert';
import inventoryManagementService from "service/inventoryManagementService";
import userManagementService from "service/userManagementService";
import userControlService from "service/userControlService";
import ErrorInformation from "components/layout/ErrorInformation";
import Switch from "@mui/material/Switch";
import Cookies from 'js-cookie';

const base64 = require('base-64');

const LoginForm: FC = () => {
    const { setLogin, setUserId, setFirstName, setLastName, setDepartmentId, setAdmin, setSuperAdmin, setAdminMode, setDepartmentName, setDroppingReviewer, setToken } =
        useContext(UserContext);

    const [loginError, setLoginError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [serverError, setServerError] = useState(false);
    const [rememberMeCookieDaysUntilExpiration, setRememberMeCookieDaysUntilExpiration] = useState(1);
    const router = useRouter();

    useEffect(() => {
        userManagementService.getConfiguration().then(c => {
            setRememberMeCookieDaysUntilExpiration(c.rememberMeCookieDaysUntilExpiration);
        });
    }, [])

    useEffect(() => {
        const rememberMeToken = Cookies.get("rememberMe");
        if (rememberMeToken) {
            fetchUserByToken(rememberMeToken);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = (usernameEncoded: string, angemeldetBleiben: boolean) => {
        userManagementService.getUser(usernameEncoded, angemeldetBleiben)
            .then((result: IUser) => {
                handleGetUserSuccess(result);
            })
            .catch((error) => {
                console.log(error);
                setServerError(true);
            });
    }

    const fetchUserByToken = (userToken: string) => {
        userManagementService.getUserByToken(userToken)
            .then((result: IUser) => {
                handleGetUserSuccess(result);
            })
            .catch((error) => {
                // if userByToken request fails, remove cookie and show Login
                Cookies.remove("rememberMe");
                setLoading(false);
                console.log(error);
            });
    }

    const handleGetUserSuccess = (result: IUser) => {
        if (result.token) {
            Cookies.set("rememberMe", result.token, { expires: rememberMeCookieDaysUntilExpiration });
        } else {
            Cookies.remove("rememberMe");
        }
        setUserId(result.id);
        setFirstName(result.firstName);
        setLastName(result.lastName);
        setAdmin(result.admin);
        setSuperAdmin(result.superAdmin);
        setToken(result.token);
        if (result.admin || result.superAdmin) {
            setAdminMode(true);
        } else {
            setAdminMode(false);
        }
        fetchDepartment(result.id);
        fetchDepartmentMember(result.id);
        if (!router.pathname.includes('[id]')) {
            // to force password saving prompt
            router.push(router.pathname);
        }
    };

    const fetchDepartmentMember = (userId: number) => {
        inventoryManagementService.getDepartmentMember(userId)
            .then(m => {
                setDroppingReviewer(m.droppingReviewer);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLogin(true);
                setLoading(false);
            });
    };
    const fetchDepartment = (userId: number) => {
        inventoryManagementService.getDepartmentOfUser(userId)
            .then((result: IDepartment) => {
                if (result.id && result.departmentName) {
                    setDepartmentId(result.id);
                    setDepartmentName(result.departmentName);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLogin(true);
                setLoading(false);
            });
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const username = String(data.get('username'));
        const angemeldetBleiben = Boolean(data.get('angemeldetBleiben'));
        const base64Token = base64.encode(username + ':' + String(data.get('password')));
        const usernameEncoded = base64.encode(username.replace(/ /g, '_'));
        let headers = new Headers();
        headers.append('Authorization', 'Basic ' + base64Token);
        // to prevent authentication pop-up window
        headers.append('X-Requested-With', 'XMLHttpRequest');
        setLoginError(false);
        setServerError(false);
        userControlService.checkUser(headers)
            .then((response) => {
                if (response.ok) {
                    // match the user with the database
                    fetchUser(usernameEncoded, angemeldetBleiben);
                }
            })
            .catch((error) => {
                console.log(error);
                setLoginError(true);
            });
    };

    if (loading) {
        return (<div />);
    } else {
        return (<Container maxWidth="sm">
            <Box sx={{ my: 12 }}>
                <Typography
                    variant="h1"
                    align="center"
                >
                    Anmelden
                </Typography>
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ mt: 1 }}
                    >
                        <Grid>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                style={{
                                    width: '20em'
                                }}
                                id="username"
                                label="Benutzername"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                error={loginError}
                            />
                        </Grid>
                        <Grid>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                style={{
                                    width: '20em'
                                }}
                                name="password"
                                label="Passwort"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                error={loginError}
                            />
                        </Grid>
                        <Grid>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch

                                            name="angemeldetBleiben"
                                            id="angemeldetBleiben"
                                        />
                                    }
                                    label='Angemeldet bleiben?'
                                />
                            </FormGroup>
                        </Grid>
                        {loginError && (
                            <CustomAlert
                                state="error"
                                message="Zugangsdaten unbekannt!"
                            />
                        )}
                        {serverError && (
                            <ErrorInformation></ErrorInformation>
                        )}
                        <Grid>
                            <Grid
                                container
                                direction="column"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Button
                                    type="submit"
                                    id="loginButton"
                                    fullWidth
                                    style={{
                                        width: '22.5em',
                                        marginTop: '1em'
                                    }}
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    data-testid="loginButton"
                                >
                                    Anmelden
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Box>
        </Container>
        );
    }
};

export default LoginForm;
