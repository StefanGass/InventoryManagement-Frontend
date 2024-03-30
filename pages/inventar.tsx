import { useContext } from 'react';
import { Container } from '@mui/material';
import { UserContext } from './_app';
import DataTableInventorySearchable from 'components/tables/DataTableInventorySearchable';
import AdminModeInformation from 'components/layout/AdminModeInformation';
import CustomHeading1 from 'components/layout/CustomHeading1';

export default function Inventar() {
    const { isAdmin, isSuperAdmin, isAdminModeActivated, departmentId } = useContext(UserContext);

    return (
        <Container
            maxWidth={false}
            sx={{ my: 12 }}
        >
            <CustomHeading1 text="Inventarverzeichnis" />
            <AdminModeInformation />
            <DataTableInventorySearchable
                getSearchUrl={(search) =>
                    (isAdmin || isSuperAdmin) && isAdminModeActivated
                        ? `${process.env.HOSTNAME}/api/inventorymanagement/inventory${search ? `/search?search=${search.trim()}` : ''}`
                        : `${process.env.HOSTNAME}/api/inventorymanagement/inventory${search ? `/search` : ''}/department/${departmentId}${
                              search ? `?search=${search.trim()}` : ''
                          }`
                }
                isShowSwitchAndLegend={true}
            />
        </Container>
    );
}
