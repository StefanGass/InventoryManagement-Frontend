import { useContext, useEffect, useState } from 'react';
import { DataGrid, GRID_STRING_COL_DEF, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
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
import { format } from 'date-fns';

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

let columns: GridColDef[] = [
    { field: 'itemInternalNumber', headerName: 'Inventarnummer', width: 140, type: 'string' },
    { field: 'category', headerName: 'Kategorie', width: 140, type: 'string' },
    { field: 'type', headerName: 'Typ', width: 200, type: 'string' },
    { field: 'itemName', headerName: 'Beschreibung', width: 260, type: 'string' },
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
        },
        type: 'string'
    },
    { field: 'location', headerName: 'Standort', width: 200, type: 'string' },
    { field: 'room', headerName: 'Raum', width: 150, type: 'string' },
    { field: 'pieces', headerName: 'Stk. ges.', width: 75, type: 'number' },
    { field: 'piecesStored', headerName: 'Stk. lag.', width: 75, type: 'number' },
    { field: 'piecesIssued', headerName: 'Stk. agg.', width: 75, type: 'number' },
    { field: 'piecesDropped', headerName: 'Stk. ags.', width: 75, type: 'number' },
    { field: 'oldItemNumber', headerName: 'Alte Inventarnr.', width: 140, type: 'string' },
    { field: 'serialNumber', headerName: 'Seriennummer', width: 130, type: 'string' },
    {
        field: 'deliveryDate',
        headerName: 'Liefer-/Kaufdatum',
        width: 130,
        type: 'date',
        renderCell: (params: GridRenderCellParams<Date>) => {
            return params.value ? format(params.value, 'dd.MM.yyyy') : '';
        }
    },
    {
        field: 'warrantyEndDate',
        headerName: 'Garantieablauf',
        width: 130,
        type: 'date',
        renderCell: (params: GridRenderCellParams<Date>) => {
            return params.value ? format(params.value, 'dd.MM.yyyy') : '';
        }
    },
    {
        field: 'issueDate',
        headerName: 'Ausgabedatum',
        width: 120,
        type: 'date',
        renderCell: (params: GridRenderCellParams<Date>) => {
            return params.value ? format(params.value, 'dd.MM.yyyy') : '';
        }
    },
    { field: 'issuedTo', headerName: 'Ausgegeben an', width: 140, type: 'string' },
    { field: 'supplier', headerName: 'Lieferant', width: 120, type: 'string' },
    { field: 'department', headerName: 'Abteilung', width: 120, type: 'string' },
    {
        field: 'droppingDate',
        headerName: 'Ausscheidedatum',
        width: 140,
        type: 'date',
        renderCell: (params: GridRenderCellParams<Date>) => {
            return params.value ? format(params.value, 'dd.MM.yyyy') : '';
        }
    },
    {
        field: 'creationDate',
        headerName: 'Anlagedatum',
        width: 160,
        type: 'dateTime',
        renderCell: (params: GridRenderCellParams<Date>) => {
            return params.value ? format(params.value, 'dd.MM.yyyy, HH:mm') : '';
        }
    },
    {
        field: 'lastChangedDate',
        headerName: 'Letzte Änderung',
        width: 160,
        type: 'dateTime',
        renderCell: (params: GridRenderCellParams<Date>) => {
            return params.value ? format(params.value, 'dd.MM.yyyy, HH:mm') : '';
        }
    }
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
        },
        type: 'string'
    },
    { field: 'droppingQueue', headerName: 'Vorgang', width: 120, type: 'string' },
    { field: 'droppingQueuePieces', headerName: 'Anzahl', width: 80, type: 'string' },
    {
        field: 'droppingQueueDate',
        headerName: 'Datum',
        width: 140,
        type: 'dateTime',
        renderCell: (params: GridRenderCellParams<Date>) => {
            return params.value ? format(params.value, 'dd.MM.yyyy, HH:mm') : '';
        }
    },
    { field: 'droppingQueueReason', headerName: 'Grund', width: 200, type: 'string' },
    {
        field: 'separationLine',
        headerName: '||',
        width: 10,
        filterable: false,
        sortable: false,
        disableColumnMenu: true,
        headerAlign: 'center',
        align: 'center',
        type: 'string'
    }
];

// exclude some standard MUI filter operators, since they don't work properly
const excludeFilterOperators = (colDef: GridColDef) => {
    if (colDef.type === 'string') {
        colDef.filterOperators =
            GRID_STRING_COL_DEF.filterOperators?.filter((operator) => operator.value !== 'startsWith' && operator.value !== 'endsWith') ?? [];
    }
    return colDef;
};
columns = columns.map(excludeFilterOperators);

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

    function getIssuedToString(item: IDetailInventoryItem) {
        if (!item.issuedTo || item.status !== CommonConstants.VERTEILT) {
            return item.issuedTo || '';
        } else {
            return item.issuedTo
                .split('\n')
                .filter((line) => line) // remove empty lines
                .map((line) => {
                    const parts = line.split('~');
                    return parts[parts.length - 1]; // extract the last element of every line
                })
                .join(', ');
        }
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
                            room: item.room,
                            pieces: item.pieces,
                            piecesStored: item.piecesStored,
                            piecesIssued: item.piecesIssued,
                            piecesDropped: item.piecesDropped,
                            oldItemNumber: item.oldItemNumber,
                            serialNumber: item.serialNumber,
                            deliveryDate: item.deliveryDate ? new Date(item.deliveryDate) : null,
                            warrantyEndDate: item.warrantyEndDate ? new Date(item.warrantyEndDate) : null,
                            issueDate: item.issueDate ? new Date(item.issueDate) : null,
                            issuedTo: getIssuedToString(item),
                            droppingDate: item.droppingDate ? new Date(item.droppingDate) : null, // no need to manipulate the string for distributed items, because distributed items manage dropped items inside droppingReason parameter
                            supplier: item.supplier?.supplierName,
                            department: item.department?.departmentName,
                            creationDate: item.creationDate ? new Date(item.creationDate) : null,
                            lastChangedDate: item.lastChangedDate ? new Date(item.lastChangedDate) : null,
                            active: item.active,
                            task: item.droppingQueueRequester !== userId,
                            droppingQueue: item.droppingQueue,
                            droppingQueueDate: item.droppingQueueDate ? new Date(item.droppingQueueDate) : null,
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
                    Stk ges. / lag. / agg. / ags. ... Stück gesamt / lagernd / ausgegeben / ausgeschieden
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
