import { FC, useContext, useEffect, useState } from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import DataTableInventory from 'components/tables/DataTableInventory';
import { IInventoryItem } from 'components/interfaces';
import LoadingSpinner from 'components/layout/LoadingSpinner';
import ServerErrorAlert from 'components/alerts/ServerErrorAlert';
import { UserContext } from 'pages/_app';

const Index: FC = () => {
    const { login, departmentId, superAdmin } = useContext(UserContext);

    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState(false);

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
        if (login) {
            fetch(
                superAdmin
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
        } else {
            handleError('Login false...');
        }
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
                        Inventarmanagement
                    </Typography>
                </Grid>
                {loading ? (
                    <LoadingSpinner />
                ) : serverError ? (
                    <ServerErrorAlert />
                ) : (
                    <DataTableInventory
                        items={items}
                        setItems={setItems}
                        activeAndNotDroppedItems={activeAndNotDroppedItems}
                        activeAndNotActiveAndNotDroppedItems={activeAndNotActiveAndNotDroppedItems}
                        activeAndDroppedAndNotDroppedItems={activeAndDroppedAndNotDroppedItems}
                        allItems={allItems}
                    />
                )}
            </Box>
        </Container>
    );
};

export default Index;
