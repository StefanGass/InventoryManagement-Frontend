import { FC, useContext } from "react";
import { Box, Container, Grid } from "@mui/material";
import { UserContext } from "pages/_app";
import DataTableInventorySearchable from "components/tables/DataTableInventorySearchable";
import AdminModeInformation from "components/layout/AdminModeInformation";
import PageHeader from "components/layout/PageHeader";

const Inventar: FC = () => {
    const { admin, superAdmin, adminMode, departmentId } = useContext(UserContext);

    return (
        <Container maxWidth={false}>
            <Box sx={{ my: 12 }}>
                <Grid item>
                    <PageHeader title="Inventarverzeichnis" id="inventarHeader"></PageHeader>
                </Grid>
                <>
                    <AdminModeInformation></AdminModeInformation>
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
