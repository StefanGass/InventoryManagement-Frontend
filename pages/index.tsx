import { useContext, useEffect, useState } from 'react';
import { Box, Container, Grid, Tooltip, Typography, useMediaQuery } from '@mui/material';
import LoadingSpinner from 'components/layout/LoadingSpinner';
import { UserContext } from './_app';
import { IChartItem } from 'components/interfaces';
import DataTableTypeChart from 'components/tables/DataTableTypeChart';
import CustomPieChart from 'components/charts/CustomPieChart';
import CustomMultilineChart from 'components/charts/CustomMultilineChart';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { Info } from '@mui/icons-material';
import defaultTheme from 'styles/theme';
import DataTableInventorySearchable from 'components/tables/DataTableInventorySearchable';
import CustomHeading1 from 'components/layout/CustomHeading1';
import ErrorInformation from 'components/layout/ErrorInformation';
import CustomAlert from 'components/form-fields/CustomAlert';
import Link from 'components/layout/Link';

export default function Index() {
    const { isNewTasksAvailable, isAdmin, isSuperAdmin, isAdminModeActivated, setIsAdminModeActivated, departmentId } = useContext(UserContext);

    const matchesPhone = useMediaQuery(defaultTheme.breakpoints.down('sm'));

    const [isLoading, setIsLoading] = useState(false);
    const [isServerError, setIsServerError] = useState(false);

    const [activityItems, setActivityItems] = useState<IChartItem[]>([]);
    const [typeChartItems, setTypeChartItems] = useState<IChartItem[]>([]);
    const [departmentChartItems, setDepartmentChartItems] = useState<IChartItem[]>([]);

    const [isSwitchDisabled, setIsSwitchDisabled] = useState(true);
    const [checkedSwitch, setCheckedSwitch] = useState(isAdminModeActivated);

    function handleError(error: any) {
        setIsServerError(true);
        setIsLoading(false);
    }

    function handleChange(event: { target: { checked: boolean | ((prevState: boolean) => boolean) } }) {
        setCheckedSwitch(event.target.checked);
        if (isAdminModeActivated) {
            setIsAdminModeActivated(false);
        } else {
            setIsAdminModeActivated(true);
        }
    }

    function getRequestDepartmentChart() {
        fetch(`${process.env.HOSTNAME}/api/inventorymanagement/chart/department`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((response) => {
                if (response.ok) {
                    response
                        .json()
                        .then((result) => {
                            setDepartmentChartItems(result);
                        })
                        .catch((error) => {
                            handleError(error);
                        });
                } else {
                    handleError(response);
                }
            })
            .catch((error) => {
                handleError(error);
            });
    }

    function getRequestTypeChart() {
        fetch(
            (isAdmin || isSuperAdmin) && isAdminModeActivated
                ? `${process.env.HOSTNAME}/api/inventorymanagement/chart/type`
                : `${process.env.HOSTNAME}/api/inventorymanagement/chart/type/department/${departmentId}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }
        )
            .then((response) => {
                if (response.ok) {
                    response
                        .json()
                        .then((result) => {
                            setTypeChartItems(result);
                            (isAdmin || isSuperAdmin) && checkedSwitch && getRequestDepartmentChart();
                        })
                        .catch((error) => {
                            handleError(error);
                        });
                } else {
                    handleError(response);
                }
            })
            .catch((error) => {
                handleError(error);
            });
    }

    function getRequests() {
        fetch(
            (isAdmin || isSuperAdmin) && checkedSwitch
                ? `${process.env.HOSTNAME}/api/inventorymanagement/chart/activity`
                : `${process.env.HOSTNAME}/api/inventorymanagement/chart/activity/department/${departmentId}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }
        )
            .then((response) => {
                if (response.ok) {
                    response
                        .json()
                        .then((result) => {
                            setActivityItems(result);
                            getRequestTypeChart();
                        })
                        .catch((error) => {
                            handleError(error);
                        });
                    setIsLoading(false);
                } else {
                    handleError(response);
                }
            })
            .catch((error) => {
                handleError(error);
            });
        setIsLoading(false);
    }

    useEffect(() => {
        if ((isAdmin || isSuperAdmin) && departmentId !== undefined && departmentId !== -1) {
            setIsSwitchDisabled(false);
        }
    }, []);

    useEffect(() => {
        setIsLoading(true);
        setIsServerError(false);
        getRequests();
    }, [checkedSwitch]);

    return (
        <Container
            maxWidth={false}
            sx={{ my: 12 }}
        >
            <CustomHeading1 text="Dashboard" />
            {isLoading ? (
                <LoadingSpinner />
            ) : isServerError ? (
                <ErrorInformation />
            ) : (
                <Grid>
                    {(isAdmin || isSuperAdmin) && (
                        <Grid
                            container
                            width="95%"
                            margin="auto"
                            alignItems="center"
                            justifyContent={matchesPhone ? 'center' : 'left'}
                            marginBottom={matchesPhone ? '1em' : 0}
                        >
                            {isSwitchDisabled && (
                                <Tooltip
                                    title="Um die Funktion nutzen zu können musst du dir zunächst eine Abteilung zuweisen!"
                                    enterDelay={500}
                                    followCursor={true}
                                >
                                    <Info
                                        color="primary"
                                        sx={{ marginRight: '0.5em' }}
                                    />
                                </Tooltip>
                            )}
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={checkedSwitch}
                                            onChange={handleChange}
                                            value={checkedSwitch}
                                            disabled={isSwitchDisabled}
                                        />
                                    }
                                    label={`${checkedSwitch ? 'Admin-Modus deaktivieren' : 'Admin-Modus aktivieren'}`}
                                />
                            </FormGroup>
                        </Grid>
                    )}
                    {isNewTasksAvailable && (
                        <Box sx={{ marginBottom: '1em' }}>
                            <Link
                                href="/aufgaben"
                                underline="none"
                            >
                                <CustomAlert
                                    state="info"
                                    message="Neue Aufgabe(n) verfügbar!"
                                />
                            </Link>
                        </Box>
                    )}
                    <Typography
                        variant="h2"
                        align="center"
                        gutterBottom
                    >
                        Aktivität
                        <br />
                    </Typography>
                    <Grid marginRight="40px">
                        <CustomMultilineChart itemList={activityItems} />
                    </Grid>
                    <Box sx={{ my: 4 }} />
                    <Typography
                        variant="h2"
                        align="center"
                        gutterBottom
                    >
                        Letzte Änderungen
                        <br />
                    </Typography>
                    <DataTableInventorySearchable
                        isShowSwitchAndLegend={false}
                        getSearchUrl={(search) =>
                            (isAdmin || isSuperAdmin) && checkedSwitch
                                ? `${process.env.HOSTNAME}/api/inventorymanagement/chart/last_items${search ? '?search=' + search : ''}`
                                : `${process.env.HOSTNAME}/api/inventorymanagement/chart/last_items/department/${departmentId}${
                                      search ? '?search=' + search : ''
                                  }`
                        }
                    />
                    <Box sx={{ my: 4 }} />
                    <Typography
                        variant="h2"
                        align="center"
                        gutterBottom
                    >
                        Auswertung nach Typ
                        <br />
                    </Typography>
                    {typeChartItems.length > 0 ? (
                        <DataTableTypeChart chartItemList={typeChartItems} />
                    ) : (
                        <Typography
                            align="center"
                            marginBottom="3em"
                        >
                            Es wurden noch keine Gegenstände oder Typen erfasst.
                        </Typography>
                    )}
                    {(isAdmin || isSuperAdmin) && checkedSwitch && departmentChartItems.length > 0 && departmentChartItems[0].pieces > 0 && (
                        <Grid>
                            <Box sx={{ my: 4 }} />
                            <Typography
                                variant="h2"
                                align="center"
                                gutterBottom
                            >
                                Stück gesamt pro Abteilung
                            </Typography>
                            <CustomPieChart itemList={departmentChartItems} />
                        </Grid>
                    )}
                </Grid>
            )}
        </Container>
    );
}
