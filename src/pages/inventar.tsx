import { FC, useContext, useEffect, useState } from 'react';
import { Box, Container, Grid, Tooltip, Typography } from '@mui/material';
import DataTableInventory from 'components/tables/DataTableInventory';
import { IInventoryItem } from 'components/interfaces';
import LoadingSpinner from 'components/layout/LoadingSpinner';
import { UserContext } from 'pages/_app';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import CustomAlert from 'components/form-fields/CustomAlert';

const Inventar: FC = () => {
    const { admin, superAdmin, adminMode, departmentId } = useContext(UserContext);

    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState(false);
    const [itemListEmptyText, setItemListEmptyText] = useState(false);

    const [items, setItems] = useState<IInventoryItem[]>([]);
    const [activeAndNotDroppedItems] = useState<IInventoryItem[]>([]);
    const [activeAndNotActiveAndNotDroppedItems] = useState<IInventoryItem[]>([]);
    const [activeAndDroppedAndNotDroppedItems] = useState<IInventoryItem[]>([]);
    const [allItems] = useState<IInventoryItem[]>([]);

    const handleError = (error: any) => {
        console.log(error);
        setServerError(true);
        setLoading(false);
    };

    const getRequest = () => {
        fetch(
            (admin || superAdmin) && adminMode
                ? `${process.env.HOSTNAME}/api/inventorymanagement/inventory`
                : `${process.env.HOSTNAME}/api/inventorymanagement/inventory/department/${departmentId}`,
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
                            if (result.length > 0) {
                                for (const item of result) {
                                    allItems.push(item);
                                    if (item.active && item.pieces !== item.piecesDropped) {
                                        activeAndNotDroppedItems.push(item);
                                        activeAndNotActiveAndNotDroppedItems.push(item);
                                        activeAndDroppedAndNotDroppedItems.push(item);
                                    } else if (!item.active) {
                                        activeAndNotActiveAndNotDroppedItems.push(item);
                                    } else if (item.pieces === item.piecesDropped) {
                                        activeAndDroppedAndNotDroppedItems.push(item);
                                    }
                                }
                                setItems(activeAndNotDroppedItems);
                            } else {
                                setItemListEmptyText(true);
                            }
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
        setLoading(true);
        setServerError(false);
        getRequest();
    }, []);

    return (
        <Container maxWidth={false}>
            <Box sx={{ my: 12 }}>
                <Grid item>
                    <Typography
                        variant="h1"
                        align="center"
                        gutterBottom
                    >
                        Inventarverzeichnis
                    </Typography>
                </Grid>
                {loading ? (
                    <LoadingSpinner />
                ) : serverError ? (
                    <CustomAlert
                        state="warning"
                        message="Serverfehler - bitte kontaktiere die IT!"
                    />
                ) : itemListEmptyText ? (
                    <Typography
                        align="center"
                        marginBottom="3em"
                    >
                        Es wurden noch keine Gegenstände erfasst.
                    </Typography>
                ) : (
                    <>
                        {(admin || superAdmin) && (
                            <Grid
                                container
                                width="95%"
                                margin="auto"
                                alignItems="center"
                            >
                                <Tooltip
                                    title={'Bitte auf dem Dashboard aktivieren/deaktivieren!'}
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
                                            label={`${adminMode ? 'Admin-Ansicht deaktivieren' : 'Admin-Ansicht aktivieren'}`}
                                        />
                                    </FormGroup>
                                </Tooltip>
                            </Grid>
                        )}
                        {allItems.length > 0 ? (
                            <DataTableInventory
                                items={items}
                                setItems={setItems}
                                activeAndNotDroppedItems={activeAndNotDroppedItems}
                                activeAndNotActiveAndNotDroppedItems={activeAndNotActiveAndNotDroppedItems}
                                activeAndDroppedAndNotDroppedItems={activeAndDroppedAndNotDroppedItems}
                                allItems={allItems}
                                showSwitchSearchBarAndLegend={true}
                            />
                        ) : (
                            <LoadingSpinner />
                        )}
                    </>
                )}
            </Box>
        </Container>
    );
};

export default Inventar;
