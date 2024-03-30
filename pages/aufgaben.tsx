import { useContext, useEffect, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import AdminModeInformation from 'components/layout/AdminModeInformation';
import CustomHeading1 from 'components/layout/CustomHeading1';
import DataTableInventory from 'components/tables/DataTableInventory';
import { IDetailInventoryItem } from 'components/interfaces';
import ErrorInformation from 'components/layout/ErrorInformation';
import inventoryManagementService from 'service/inventoryManagementService';
import CustomAlert from 'components/form-fields/CustomAlert';
import { UserContext } from './_app';
import { EmojiEmotions } from '@mui/icons-material';

export default function Aufgaben() {
    const { isAdminModeActivated, departmentId, isDroppingReviewer } = useContext(UserContext);

    const [items, setItems] = useState<IDetailInventoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isServerError, setIsServerError] = useState(false);

    function loadItems() {
        setIsLoading(true);
        if (isAdminModeActivated) {
            inventoryManagementService
                .getAllDroppingQueueInventoryItems()
                .then((result) => {
                    setIsLoading(false);
                    setItems(result);
                })
                .catch(() => {
                    setIsLoading(false);
                    setIsServerError(true);
                });
        } else {
            inventoryManagementService
                .getDroppingQueueInventoryItemsByDepartmentId(departmentId)
                .then((result) => {
                    setIsLoading(false);
                    setItems(result);
                })
                .catch(() => {
                    setIsLoading(false);
                    setIsServerError(true);
                });
        }
    }

    useEffect(() => {
        loadItems();
    }, []);

    return (
        <Container
            maxWidth={false}
            sx={{ my: 12 }}
        >
            <CustomHeading1 text="Aufgaben" />
            <AdminModeInformation />
            {isServerError ? (
                <ErrorInformation />
            ) : (
                <>
                    {items.length > 0 ? (
                        <>
                            {!isDroppingReviewer && !isAdminModeActivated ? (
                                <CustomAlert
                                    state="warning"
                                    message="Du hast keine Berechtigung dazu, Vorgänge nach dem 4-Augen-Prinzip zu bearbeiten."
                                />
                            ) : (
                                <>
                                    <Box my={1} />
                                    <Typography textAlign="center">
                                        Öffne die Detailseite des jeweiligen Gegenstands, um dem Vorgang zuzustimmen oder ihn abzulehnen:
                                    </Typography>
                                </>
                            )}
                            <Box my={2} />
                            <DataTableInventory
                                items={items}
                                setSearch={() => {}}
                                isIncludeDroppingInformation
                                isSearching={isLoading}
                            />
                        </>
                    ) : (
                        <>
                            <Box my={2} />
                            <Typography textAlign="center">
                                Derzeit sind in deiner Abteilung keine Ausscheidungs- oder Deaktivierungs-Aufgaben nach dem 4-Augen-Prinzip offen.
                                <br />
                                Hier gibt es also zurzeit nichts zu tun. <EmojiEmotions fontSize="small" />
                            </Typography>
                        </>
                    )}
                </>
            )}
        </Container>
    );
}
