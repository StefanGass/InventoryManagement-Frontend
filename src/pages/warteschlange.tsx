import { FC, useContext, useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import { UserContext } from "pages/_app";
import AdminModeInformation from "components/layout/AdminModeInformation";
import PageHeader from "components/layout/PageHeader";
import DataTableInventory from "components/tables/DataTableInventory";
import { IInventoryItem } from "components/interfaces";
import LoadingSpinner from "components/layout/LoadingSpinner";
import ErrorInformation from "components/layout/ErrorInformation";
import inventoryManagementService from "service/inventoryManagementService";

const Warteschlange: FC = () => {
    const { admin, superAdmin, adminMode, departmentId,droppingReviewer } = useContext(UserContext);
    const [items, setItems] = useState<IInventoryItem[]>([]);
    const [serverError, setServerError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        let request: Promise<IInventoryItem[]>;
        if ((superAdmin || admin) && adminMode) {
            request = inventoryManagementService.getAllDroppingQueueInventoryItems();
        } else {
            if(!droppingReviewer) return;
            request = inventoryManagementService.getDroppingQueueInventoryItemsByDepartmentId(departmentId);
        }
        request.then(x => {
            setLoading(false);
            setItems(x);
        }).catch(error => {
            console.log(error);
            setLoading(false);
            setServerError(true);
        });
    }, []);


    const getContent = () => {
        if(loading || serverError){
            return (<></>);
        }
        return (<>
            <AdminModeInformation />
            <DataTableInventory items={items} setSearch={() => {
            }}
            />
        </>);
    };

    return (
        <Container maxWidth={false}>
            <Box sx={{ my: 12 }}>
                <>
                    <PageHeader title="Warteschlange" id="warteschlangeHeader"></PageHeader>
                    <LoadingSpinner hidden={!loading}></LoadingSpinner>
                    <ErrorInformation hidden={!serverError}></ErrorInformation>
                    {getContent()}
                </>
            </Box>
        </Container>
    );
};

export default Warteschlange;
