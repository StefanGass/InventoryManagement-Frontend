import { FC, useContext, useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import { UserContext } from "pages/_app";
import AdminModeInformation from "components/layout/AdminModeInformation";
import PageHeader from "components/layout/PageHeader";
import DataTableInventory from "components/tables/DataTableInventory";
import { IInventoryItem } from "components/interfaces";
import LoadingSpinner from "components/layout/LoadingSpinner";
import ErrorInformation from "components/layout/ErrorInformation";

const Warteschlange: FC = () => {
    const { admin, superAdmin, adminMode, departmentId } = useContext(UserContext);
    const [items, setItems] = useState<IInventoryItem[]>([]);
    const [serverError, setServerError] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleError = (error: any) => {
        console.log(error);
        setLoading(false);
        setServerError(true);
    };

    const getUrl = () => {
        return (admin || superAdmin) && adminMode
            ? `${process.env.HOSTNAME}/api/inventorymanagement/inventory/droppingQueue/`
            : `${process.env.HOSTNAME}/api/inventorymanagement/inventory/department/${departmentId}/droppingQueue/`;

    };

    const getData = () => {
        fetch(
            getUrl(),
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
                            setLoading(false);
                            setItems(result);
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
    useEffect(() => {
        setLoading(true);
        getData();
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
                    <PageHeader title="Warteschlange"></PageHeader>
                    <LoadingSpinner hidden={!loading}></LoadingSpinner>
                    <ErrorInformation hidden={!serverError}></ErrorInformation>
                    {getContent()}
                </>
            </Box>
        </Container>
    );
};

export default Warteschlange;
