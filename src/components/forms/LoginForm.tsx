import { FC, FormEvent, useContext, useState } from 'react';
import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import { IDepartment, IUser } from "components/interfaces";
import { UserContext } from 'pages/_app';
import { useRouter } from 'next/router';
import CustomAlert from 'components/form-fields/CustomAlert';
import inventoryManagementService from "service/inventoryManagementService";
import ErrorInformation from "components/layout/ErrorInformation";

const base64 = require('base-64');

const LoginForm: FC = () => {
    const { setLogin, setUserId, setFirstName, setLastName, setDepartmentId, setAdmin, setSuperAdmin, setAdminMode, setDepartmentName, setDroppingReviewer } =
        useContext(UserContext);

    const [loginError, setLoginError] = useState(false);
    const [serverError, setServerError] = useState(false);
    const router = useRouter();

    const fetchDepartmentMember = (userId) => {
        inventoryManagementService.getDepartmentMember(userId)
            .then(m => {
                setDroppingReviewer(m.droppingReviewer);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLogin(true);
            });
    };
    const fetchDepartment = (userId) => {
        fetch(`${process.env.HOSTNAME}/api/inventorymanagement/department/user/${userId}`, {
            method: 'GET'
        })
            .then((res) => res.json())
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
            });
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let headers = new Headers();
        headers.append('Authorization', 'Basic ' + base64.encode(String(data.get('username')) + ':' + String(data.get('password'))));
        // to prevent authentication pop-up window
        headers.append('X-Requested-With', 'XMLHttpRequest');
        setLoginError(false);
        setServerError(false);
        fetch(`${process.env.HOSTNAME}/api/usercontrol`, {
            method: 'GET',
            headers: headers
        })
            .then((response) => {
                if (response.ok) {
                    // match the user with the database
                    fetch(`${process.env.HOSTNAME}/api/usermanagement/user/${base64.encode(String(data.get('username')).replace(/ /g, '_'))}`)
                        .then((res) => res.json())
                        .then((result: IUser) => {
                            setUserId(result.id);
                            setFirstName(result.firstName);
                            setLastName(result.lastName);
                            setAdmin(result.admin);
                            setSuperAdmin(result.superAdmin);
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
                        })
                        .catch((error) => {
                            console.log(error);
                            setServerError(true);
                        });
                } else {
                    console.log('Wrong credentials');
                    setLoginError(true);
                }
            })
            .catch((error) => {
                console.log(error);
                setServerError(true);
            });
    };

    return (
        <Container maxWidth="sm">
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
};

export default LoginForm;
