import { FormEvent, useContext, useState } from 'react';
import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import { IDepartment, IUser } from 'components/interfaces';
import { UserContext } from '../../../pages/_app';
import CustomAlert from 'components/form-fields/CustomAlert';
import { Login } from '@mui/icons-material';
import { routes } from 'constants/routes';
import inventoryManagementService from 'service/inventoryManagementService';

const base64 = require('base-64');

export default function LoginForm() {
    const {
        setAuthHeaders,
        setIsAuthenticated,
        setAvailableRoutesList,
        setUserId,
        setFirstName,
        setLastName,
        setDepartmentId,
        setIsDroppingReviewer,
        setIsAdmin,
        setIsSuperAdmin,
        setIsAdminModeActivated,
        setDepartmentName
    } = useContext(UserContext);

    const [isLoginError, setIsLoginError] = useState(false);
    const [isPermissionError, setIsPermissionError] = useState(false);
    const [isServerError, setIsServerError] = useState(false);

    function fetchDepartment(userId, isAdmin, isSuperAdmin) {
        fetch(`${process.env.HOSTNAME}/api/inventorymanagement/department/user/${userId}`, {
            method: 'GET'
        })
            .then((res) => res.json())
            .then((result: IDepartment) => {
                if (result.id && result.departmentName) {
                    setDepartmentId(result.id);
                    setDepartmentName(result.departmentName);
                    fetchDepartmentMember(userId);
                } else if (isAdmin || isSuperAdmin) {
                    setIsAdminModeActivated(true);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => { // this needs to be done here, else an admin without a department won't be able to log in
                setIsAuthenticated(true);
                setAvailableRoutesList(routes);
            });
    }

    const fetchDepartmentMember = (userId: number) => {
        inventoryManagementService
            .getDepartmentMember(userId)
            .then((result) => {
                setIsDroppingReviewer(result.droppingReviewer);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoginError(false);
        setIsPermissionError(false);
        setIsServerError(false);
        const data = new FormData(event.currentTarget);
        let headers = new Headers();
        headers.append('Authorization', 'Basic ' + base64.encode(String(data.get('username')).trim() + ':' + String(data.get('password'))));
        headers.append('X-Requested-With', 'XMLHttpRequest'); // to prevent authentication pop-up window
        setAuthHeaders(new Headers(headers)); // make a copy of the headers so the Content-Type is not included by default
        headers.append('Content-Type', 'application/json');
        fetch(`${process.env.HOSTNAME}/api/usermanagement/user/${base64.encode(String(data.get('username')).trim())}`, {
            method: 'GET',
            headers: headers
        })
            .then((response) => {
                if (response.ok) {
                    response.json().then((result: IUser) => {
                        if (result.authInventoryManagement || result.admin || result.superAdmin) {
                            setUserId(result.id);
                            setFirstName(result.firstName);
                            setLastName(result.lastName);
                            setIsAdmin(result.admin);
                            setIsSuperAdmin(result.superAdmin);
                            fetchDepartment(result.id, result.admin, result.superAdmin);
                        } else {
                            setIsPermissionError(true);
                        }
                    });
                } else {
                    if (response.status === 401) {
                        setIsLoginError(true);
                    } else {
                        setIsServerError(true);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                setIsServerError(true);
            });
    }

    return (
        <Container
            maxWidth="sm"
            sx={{ my: 12 }}
        >
            <Typography
                variant="h1"
                align="center"
            >
                Inventar-Management
            </Typography>
            <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
            >
                <Box
                    component="form"
                    onSubmit={handleLoginSubmit}
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
                            error={isLoginError}
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
                            error={isLoginError}
                        />
                    </Grid>
                    {isLoginError && (
                        <CustomAlert
                            state="error"
                            message="Zugangsdaten unbekannt!"
                        />
                    )}
                    {isPermissionError && (
                        <CustomAlert
                            state="warning"
                            message={
                                'Du besitzt nicht die nötigen Berechtigungen, die zum Login nötig sind. ' +
                                'Wende dich an die IT, um die entsprechenden Zugriffsrechte anzufordern.'
                            }
                        />
                    )}
                    {isServerError && (
                        <CustomAlert
                            state="warning"
                            message="Serverfehler - bitte kontaktiere die IT!"
                        />
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
                                fullWidth
                                style={{
                                    height: '3em',
                                    marginTop: '1em'
                                }}
                                variant="contained"
                            >
                                <Login
                                    fontSize="small"
                                    sx={{ marginRight: '0.3em' }}
                                />
                                ANMELDEN
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Container>
    );
}
