import { FC, FormEvent, useContext, useState } from 'react';
import { Alert, Box, Button, Container, Grid, Stack, TextField, Typography } from '@mui/material';
import { IDepartment, IUser } from 'components/interfaces';
import { UserContext } from 'pages/_app';

const LoginForm: FC = () => {
    const { setLogin, setUserId, setFirstName, setLastName, setDepartmentId, setSuperAdmin, setDepartmentName } = useContext(UserContext);

    const base64 = require('base-64');

    const [loginError, setLoginError] = useState(false);
    const [serverError, setServerError] = useState(false);

    const fetchDepartment = (userId) => {
        fetch(`${process.env.HOSTNAME}/api/inventorymanagement/department/user/${userId}`, {
            method: 'GET'
        })
            .then((res) => res.json())
            .then((result: IDepartment) => {
                setDepartmentId(result.id);
                setDepartmentName(result.departmentName);
                setLogin(true);
            })
            .catch(() => {
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
                            setSuperAdmin(result.superAdmin);
                            if (result.superAdmin) {
                                setLogin(true);
                            } else {
                                fetchDepartment(result.id);
                            }
                        })
                        .catch(() => {
                            setServerError(true);
                        });
                } else {
                    console.log('Wrong credentials');
                    setLoginError(true);
                }
            })
            .catch(() => {
                setServerError(true);
            });
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ my: 12 }}>
                <Grid>
                    <Typography
                        variant="h1"
                        align="center"
                    >
                        Anmelden
                    </Typography>
                    {(loginError || serverError) && (
                        <Grid
                            container
                            justifyContent="center"
                        >
                            <Stack
                                sx={{ width: '20em', marginTop: '1em' }}
                                spacing={2}
                            >
                                {loginError ? (
                                    <Alert severity="error">Zugangsdaten unbekannt!</Alert>
                                ) : (
                                    <Alert severity="warning">Serverfehler - bitte kontaktiere die IT!</Alert>
                                )}
                            </Stack>
                        </Grid>
                    )}
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
                                <Grid
                                    container
                                    direction="column"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Button
                                        type="submit"
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
                </Grid>
            </Box>
        </Container>
    );
};

export default LoginForm;
