import { useContext, useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { Box, Chip, Grid, Typography } from '@mui/material';
import { IDataTableInventory, IDetailInventoryItem } from 'components/interfaces';
import CommonConstants from 'constants/InventoryItemStatusConstants';
import { darkGrey, lightGrey } from 'styles/theme';
import { useRouter } from 'next/router';
import styles from 'styles/DataTableInventory.module.scss';
import SearchForm from 'components/forms/inventory-form/SearchForm';
import { Cancel, FlagCircle, Lock } from '@mui/icons-material';
import { UserContext } from '../../../pages/_app';

const getColour = (param: string) => {
    switch (param) {
        case CommonConstants.LAGERND:
            return 'success';
        case CommonConstants.AUSGEGEBEN:
            return 'info';
        case CommonConstants.AUSGESCHIEDEN:
            return 'error';
        case CommonConstants.DEAKTIVIERT:
            return 'default';
        case CommonConstants.VERTEILT:
        default:
            return 'warning';
    }
};

const columns: GridColDef[] = [
    { field: 'itemInternalNumber', headerName: 'Inventarnummer', width: 140 },
    { field: 'category', headerName: 'Kategorie', width: 140 },
    { field: 'type', headerName: 'Typ', width: 200 },
    { field: 'itemName', headerName: 'Beschreibung', width: 260 },
    {
        field: 'status',
        headerName: 'Status',
        width: 145,
        renderCell: (params) => {
            const droppingQueue = params.row.droppingQueue;
            return (
                <>
                    {droppingQueue !== null && (
                        <Lock
                            fontSize="small"
                            color="error"
                            sx={{ marginRight: '2px' }}
                        />
                    )}
                    <Chip
                        label={params.value}
                        color={getColour(params.value)}
                        size="small"
                    />
                </>
            );
        }
    },
    { field: 'location', headerName: 'Standort', width: 200 },
    { field: 'pieces', headerName: 'Stück', width: 60 },
    {
        field: 'piecesStoredIssuedDropped',
        headerName: 'La / Ag / As*',
        width: 120
    },
    { field: 'oldItemNumber', headerName: 'Alte Inventarnr.', width: 140 },
    { field: 'serialNumber', headerName: 'Seriennummer', width: 130 },
    { field: 'deliveryDate', headerName: 'Lieferdatum', width: 120 },
    { field: 'issueDate', headerName: 'Ausgabedatum', width: 120 },
    { field: 'issuedTo', headerName: 'Ausgegeben an', width: 140 },
    { field: 'supplier', headerName: 'Lieferant', width: 120 },
    { field: 'department', headerName: 'Abteilung', width: 120 },
    { field: 'droppingDate', headerName: 'Ausscheidedatum', width: 140 },
    { field: 'creationDate', headerName: 'Anlagedatum', width: 160 },
    { field: 'lastChangedDate', headerName: 'Letzte Änderung', width: 160 }
];

const droppingInformationColumns: GridColDef[] = [
    {
        field: 'task',
        headerName: '#',
        width: 30,
        renderCell: (params) => {
            return params.value === true ? (
                <FlagCircle
                    fontSize="small"
                    color="info"
                />
            ) : (
                <Cancel
                    fontSize="small"
                    color="warning"
                />
            );
        }
    },
    { field: 'droppingQueue', headerName: 'Vorgang', width: 120 },
    { field: 'droppingQueuePieces', headerName: 'Anzahl', width: 80 },
    { field: 'droppingQueueDate', headerName: 'Datum', width: 100 },
    { field: 'droppingQueueReason', headerName: 'Grund', width: 200 },
    {
        field: 'separationLine',
        headerName: '||',
        width: 10,
        filterable: false,
        sortable: false,
        disableColumnMenu: true,
        headerAlign: 'center',
        align: 'center'
    }
];

export default function DataTableInventory(props: IDataTableInventory) {
    const { items, search, setSearch, isShowSearchBar, isShowSwitchAndLegend, isSearching, isIncludeDroppingInformation, selectionModel, setSelectionModel } =
        props;
    const { userId, themeMode } = useContext(UserContext);
    const [isCheckedDropped, setStateDropped] = useState(false);
    const [isCheckedDeactivated, setStateDeactivated] = useState(false);
    const router = useRouter();

    function handleChangeDroppedItems(event: { target: { checked: boolean | ((prevState: boolean) => boolean) } }) {
        setStateDropped(event.target.checked);
    }

    function handleChangeInactiveItems(event: { target: { checked: boolean | ((prevState: boolean) => boolean) } }) {
        setStateDeactivated(event.target.checked);
    }

    function convertToDateString(date: string) {
        return new Date(date).toLocaleDateString('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    function convertToDateTimeString(date: string) {
        return new Date(date).toLocaleDateString('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    }

    useEffect(() => {
        search?.toLowerCase().includes('ausgesch') && setStateDropped(true);
        search?.toLowerCase().includes('deak') && setStateDeactivated(true);
    }, [search]);

    return (
        <Grid
            item
            width="95%"
            margin="auto"
        >
            {isShowSwitchAndLegend && (
                <Grid>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isCheckedDropped}
                                    onChange={handleChangeDroppedItems}
                                    value={isCheckedDropped}
                                />
                            }
                            label={`${isCheckedDropped ? 'Ausgeschiedene Gegenstände ausblenden' : 'Ausgeschiedene Gegenstände einblenden'}`}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isCheckedDeactivated}
                                    onChange={handleChangeInactiveItems}
                                    value={isCheckedDeactivated}
                                />
                            }
                            label={`${isCheckedDeactivated ? 'Deaktivierte Gegenstände ausblenden' : 'Deaktivierte Gegenstände einblenden'}`}
                        />
                    </FormGroup>
                    <Box sx={{ my: 2 }} />
                </Grid>
            )}
            {isShowSearchBar && (
                <>
                    <SearchForm
                        setSearch={setSearch}
                        items={items}
                    />
                    <Box sx={{ my: 2 }} />
                </>
            )}
            <Box
                sx={
                    items.length < 15
                        ? { height: 'auto', filter: isSearching ? 'blur(3px)' : undefined }
                        : {
                              height: 700,
                              filter: isSearching ? 'blur(3px)' : undefined
                          }
                }
            >
                <DataGrid
                    rows={items
                        .filter((item) => {
                            if (isShowSwitchAndLegend && !isCheckedDropped && item.pieces === item.piecesDropped) {
                                return false;
                            } else if (isShowSwitchAndLegend && !isCheckedDeactivated && !item.active) {
                                return false;
                            }
                            return true;
                        })
                        .map((item: IDetailInventoryItem) => ({
                            id: item.id,
                            itemInternalNumber: item.itemInternalNumber,
                            category: item.type?.category?.categoryName,
                            type: item.type?.typeName,
                            itemName: item.itemName,
                            status: item.status,
                            location: item.location?.locationName,
                            pieces: item.pieces,
                            piecesStoredIssuedDropped: `${item.piecesStored} / ${item.piecesIssued} / ${item.piecesDropped}`,
                            oldItemNumber: item.oldItemNumber,
                            serialNumber: item.serialNumber,
                            deliveryDate: item.deliveryDate ? convertToDateString(item.deliveryDate) : null,
                            issueDate: item.issueDate ? convertToDateString(item.issueDate) : null,
                            issuedTo: item.issuedTo,
                            droppingDate: item.droppingDate ? convertToDateString(item.droppingDate) : null,
                            supplier: item.supplier?.supplierName,
                            department: item.department?.departmentName,
                            creationDate: item.creationDate ? convertToDateTimeString(item.creationDate) : null,
                            lastChangedDate: item.lastChangedDate ? convertToDateTimeString(item.lastChangedDate) : null,
                            active: item.active,
                            task: item.droppingQueueRequester !== userId,
                            droppingQueue: item.droppingQueue,
                            droppingQueueDate: item.droppingQueueDate ? convertToDateString(item.droppingQueueDate) : null,
                            droppingQueueReason: item.droppingQueueReason,
                            droppingQueuePieces: item.droppingQueuePieces,
                            separationLine: '||'
                        }))}
                    autoHeight={items.length < 15}
                    density="compact"
                    columns={isIncludeDroppingInformation ? [...droppingInformationColumns, ...columns] : columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 100
                            }
                        }
                    }}
                    pageSizeOptions={[100]}
                    hideFooterSelectedRowCount
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: {
                            csvOptions: { disableToolbarButton: true },
                            printOptions: { disableToolbarButton: true }
                        }
                    }}
                    onRowClick={(params) => router.push(`/details/${params.id}`)}
                    className={styles.hover}
                    checkboxSelection={!!selectionModel}
                    rowSelectionModel={selectionModel}
                    onRowSelectionModelChange={(selection) => {
                        if (setSelectionModel) setSelectionModel(selection);
                    }}
                    loading={isSearching}
                />
            </Box>
            {isShowSwitchAndLegend && (
                <Typography
                    variant="caption"
                    color={themeMode === 'dark' ? lightGrey : darkGrey}
                    marginTop="2em"
                >
                    * La / Ag / As ... Lagernd / Ausgegeben / Ausgeschieden (in Stück)
                </Typography>
            )}
            {isIncludeDroppingInformation && (
                <>
                    <Typography
                        fontSize="0.75rem"
                        color={themeMode === 'dark' ? lightGrey : darkGrey}
                        marginTop="1em"
                    >
                        <FlagCircle
                            fontSize="small"
                            color="info"
                            sx={{ marginRight: '3px' }}
                        />
                        ... Vorgang wurde von jemand anders initiiert und kann bestätigt oder abgelehnt werden
                    </Typography>
                    <Typography
                        fontSize="0.75rem"
                        color={themeMode === 'dark' ? lightGrey : darkGrey}
                        marginTop="0.1em"
                    >
                        <Cancel
                            fontSize="small"
                            color="warning"
                            sx={{ marginRight: '3px' }}
                        />
                        ... Vorgang wurde von dir selbst initiiert und kann lediglich abgebrochen werden
                    </Typography>
                </>
            )}
        </Grid>
    );
}
