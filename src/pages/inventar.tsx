import { FC, useContext } from "react";
import { Box, Container, Grid, Tooltip, Typography } from "@mui/material";
import { UserContext } from "pages/_app";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DataTableInventorySearchable from "components/tables/DataTableInventorySearchable";

const Inventar: FC = () => {
    const { admin, superAdmin, adminMode, departmentId } = useContext(UserContext);

    return (
        <Container maxWidth={false}>
            <Box sx={{ my: 12 }}>
                <Grid item>
                    <Typography
                        variant="h1"
                        align="center"
                        gutterBottom
                        id="inventarHeader"
                    >
                        Inventarverzeichnis
                    </Typography>
                </Grid>
                <>
                    {(admin || superAdmin) && (
                        <Grid
                            container
                            width="95%"
                            margin="auto"
                            alignItems="center"
                        >
                            <Tooltip
                                title={"Bitte auf dem Dashboard aktivieren/deaktivieren!"}
                                placement="top"
                            >
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={adminMode}
                                                value={adminMode}
                                                disabled={true}
                                            />
                                        }
                                        label={`${adminMode ? "Admin-Ansicht deaktivieren" : "Admin-Ansicht aktivieren"}`}
                                    />
                                </FormGroup>
                            </Tooltip>
                        </Grid>
                    )}
                    <DataTableInventorySearchable
                        getSearchUrl={(search) => (admin || superAdmin) && adminMode
                            ? `${process.env.HOSTNAME}/api/inventorymanagement/inventory${search ? `/search?search=${"*" + search + "*"}` : ""}`
                            : `${process.env.HOSTNAME}/api/inventorymanagement/inventory${search ? `/search` : ""}/department/${departmentId}${search ? `?search=${"*" + search + "*"}` : ""}`
                        }
                        showSwitchAndLegend={true}
                    />

                </>
            </Box>
        </Container>
    );
};

export default Inventar;
