import { FC, useContext, useEffect, useState } from "react";
import { Box, Container, Grid, Tooltip, Typography, useMediaQuery } from "@mui/material";
import LoadingSpinner from "components/layout/LoadingSpinner";
import { UserContext } from "pages/_app";
import { IChartItem } from "components/interfaces";
import DataTableTypeChart from "components/tables/DataTableTypeChart";
import CustomPieChart from "components/charts/CustomPieChart";
import CustomMultilineChart from "components/charts/CustomMultilineChart";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { Info } from "@mui/icons-material";
import lightTheme from "styles/theme";
import DataTableInventorySearchable from "components/tables/DataTableInventorySearchable";
import PageHeader from "components/layout/PageHeader";
import ErrorInformation from "components/layout/ErrorInformation";

const Index: FC = () => {
    const { admin, superAdmin, adminMode, setAdminMode, departmentId } = useContext(UserContext);

    const matchesPhone = useMediaQuery(lightTheme.breakpoints.down("sm"));

    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState(false);

    const [activityItems, setActivityItems] = useState<IChartItem[]>([]);
    const [typeChartItems, setTypeChartItems] = useState<IChartItem[]>([]);
    const [departmentChartItems, setDepartmentChartItems] = useState<IChartItem[]>([]);

    const [switchDisabled, setSwitchDisabled] = useState(true);
    const [checkedSwitch, setCheckedSwitch] = useState(adminMode);

    const handleError = (error: any) => {
        console.log(error);
        setServerError(true);
        setLoading(false);
    };

    const handleChange = (event: { target: { checked: boolean | ((prevState: boolean) => boolean) } }) => {
        setCheckedSwitch(event.target.checked);
        if (adminMode) {
            setAdminMode(false);
        } else {
            setAdminMode(true);
        }
    };

    const getRequestDepartmentChart = () => {
        fetch(`${process.env.HOSTNAME}/api/inventorymanagement/chart/department/`, {
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
    };

    const getRequestTypeChart = () => {
        fetch(
            (admin || superAdmin) && adminMode
                ? `${process.env.HOSTNAME}/api/inventorymanagement/chart/type/`
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
                            (admin || superAdmin) && checkedSwitch && getRequestDepartmentChart();
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
    };

    const getRequests = () => {
        fetch(
            (admin || superAdmin) && checkedSwitch
                ? `${process.env.HOSTNAME}/api/inventorymanagement/chart/activity/`
                : `${process.env.HOSTNAME}/api/inventorymanagement/chart/activity/department/${departmentId}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" }
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
                    setLoading(false);
                } else {
                    handleError(response);
                }
            })
            .catch((error) => {
                handleError(error);
            });
        setLoading(false);
    };

    useEffect(() => {
        if ((admin || superAdmin) && departmentId !== undefined && departmentId !== -1) {
            setSwitchDisabled(false);
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        setServerError(false);
        getRequests();
    }, [checkedSwitch]);

    return (
        <Container maxWidth={false}>
            <Box sx={{ my: 12 }}>
                <PageHeader title="Dashboard" id="dashboardHeader"></PageHeader>
                {loading ? (
                    <LoadingSpinner />
                ) : serverError ? (
                    <ErrorInformation></ErrorInformation>
                ) : (
                    <Grid>
                        {(admin || superAdmin) && (
                            <Grid
                                container
                                width="95%"
                                margin="auto"
                                alignItems="center"
                                justifyContent={matchesPhone ? 'center' : 'left'}
                                marginBottom={matchesPhone ? '1em' : 0}
                            >
                                {switchDisabled && (
                                    <Tooltip title={'Um die Funktion nutzen zu können musst du dir zunächst eine Abteilung zuweisen!'}>
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
                                                disabled={switchDisabled}
                                            />
                                        }
                                        label={`${checkedSwitch ? 'Admin-Ansicht deaktivieren' : 'Admin-Ansicht aktivieren'}`}
                                    />
                                </FormGroup>
                            </Grid>
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
                            showSwitchAndLegend={false}
                            getSearchUrl={(search) => (admin || superAdmin) && checkedSwitch
                                ? `${process.env.HOSTNAME}/api/inventorymanagement/chart/last_items/${search ? ("?search=*" + search + "*") : ""}`
                                : `${process.env.HOSTNAME}/api/inventorymanagement/chart/last_items/department/${departmentId}${search ? ("?search=*" + search + "*") : ""}`
                        }
                        />
                        <Box sx={{ my: 4 }} />
                        <Typography
                            variant="h2"
                            align="center"
                            gutterBottom
                        >
                            Stück gesamt / lagernd / ausgegeben / ausgeschieden
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
                        {(admin || superAdmin) && checkedSwitch && departmentChartItems.length > 0 && departmentChartItems[0].pieces > 0 && (
                            <Grid>
                                <Box sx={{ my: 4 }} />
                                <Typography
                                    variant="h2"
                                    align="center"
                                    gutterBottom
                                >
                                    Stück pro Abteilung
                                </Typography>
                                <CustomPieChart itemList={departmentChartItems} />
                            </Grid>
                        )}
                    </Grid>
                )}
            </Box>
        </Container>
    );
};

export default Index;
