import { FC, useState } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { ThemeProvider } from '@mui/material/styles';
import { Box, Chip, Grid } from '@mui/material';
import { tableTheme } from 'styles/tableTheme';
import { IDataTableInventory, IInventoryItem } from 'components/interfaces';
import { Typography } from '@mui/material';
import CommonConstants from 'utils/CommonConstants';
import { darkGrey } from 'styles/theme';
import { useRouter } from 'next/router';
import styles from 'styles/DataTableInventory.module.scss';

const getColour = (param: string) => {
    switch (param) {
        case CommonConstants.INACTIVE:
            return 'default';
        case CommonConstants.IN_STORE:
            return 'success';
        case CommonConstants.ISSUED:
            return 'warning';
        case CommonConstants.DROPPED:
            return 'error';
        case CommonConstants.SPREAD:
        default:
            return 'info';
    }
};

const columns: GridColDef[] = [
    { field: 'itemInternalNumber', headerName: 'Inventarnummer', width: 140 },
    { field: 'type', headerName: 'Typ', width: 140 },
    { field: 'category', headerName: 'Kategorie', width: 140 },
    { field: 'itemName', headerName: 'Bezeichnung', width: 220 },
    {
        field: 'status',
        headerName: 'Status',
        width: 145,
        renderCell: (params) => {
            if (params.value === CommonConstants.INACTIVE) {
                return <Typography>{CommonConstants.INACTIVE}</Typography>;
            } else {
                return (
                    <Chip
                        label={params.value}
                        color={getColour(params.value)}
                        size="small"
                    />
                );
            }
        }
    },
    { field: 'serialNumber', headerName: 'Seriennummer', width: 130 },
    { field: 'location', headerName: 'Standort', width: 200 },
    { field: 'deliveryDate', headerName: 'Lieferdatum', width: 120 },
    { field: 'issueDate', headerName: 'Ausgabedatum', width: 120 },
    { field: 'issuedTo', headerName: 'Ausgegeben an', width: 140 },
    { field: 'pieces', headerName: 'Stück', width: 60 },
    {
        field: 'piecesStoredIssuedDropped',
        headerName: 'La / Ag / As*',
        width: 120
    },
    { field: 'supplier', headerName: 'Lieferant', width: 120 },
    { field: 'department', headerName: 'Abteilung', width: 120 },
    { field: 'droppingDate', headerName: 'Ausscheidedatum', width: 140 },
    { field: 'lastChangedDate', headerName: 'Letzte Änderung', width: 160 }
];

const DataTableInventory: FC<IDataTableInventory> = (props) => {
    const { items, setItems, activeAndNotDroppedItems, activeAndNotActiveAndNotDroppedItems, activeAndDroppedAndNotDroppedItems, allItems } = props;

    const [checkedDropped, setStateDropped] = useState(false);
    const [checkedInactive, setStateInactive] = useState(false);
    const router = useRouter();

    const handleChangeDroppedItems = (event: { target: { checked: boolean | ((prevState: boolean) => boolean) } }) => {
        setStateDropped(event.target.checked);
        if (event.target.checked) {
            if (checkedInactive) {
                setItems(allItems);
            } else {
                setItems(activeAndDroppedAndNotDroppedItems);
            }
        } else {
            if (checkedInactive) {
                setItems(activeAndNotActiveAndNotDroppedItems);
            } else {
                setItems(activeAndNotDroppedItems);
            }
        }
    };

    const handleChangeInactiveItems = (event: { target: { checked: boolean | ((prevState: boolean) => boolean) } }) => {
        setStateInactive(event.target.checked);
        if (event.target.checked) {
            if (checkedDropped) {
                setItems(allItems);
            } else {
                setItems(activeAndNotActiveAndNotDroppedItems);
            }
        } else {
            if (checkedDropped) {
                setItems(activeAndDroppedAndNotDroppedItems);
            } else {
                setItems(activeAndNotDroppedItems);
            }
        }
    };

    return (
        <Grid
            item
            width="95%"
            margin="auto"
        >
            <FormGroup>
                <FormControlLabel
                    control={
                        <Switch
                            checked={checkedDropped}
                            onChange={handleChangeDroppedItems}
                            value={checkedDropped}
                        />
                    }
                    label={`${checkedDropped ? 'Ausgeschiedene Gegenstände ausblenden' : 'Ausgeschiedene Gegenstände einblenden'}`}
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={checkedInactive}
                            onChange={handleChangeInactiveItems}
                            value={checkedInactive}
                        />
                    }
                    label={`${checkedInactive ? 'Inaktive Gegenstände ausblenden' : 'Inaktive Gegenstände einblenden'}`}
                />
            </FormGroup>
            <Box sx={{ my: 2 }} />
            <ThemeProvider theme={tableTheme}>
                <DataGrid
                    rows={items.map((item: IInventoryItem) => ({
                        id: item.id,
                        itemInternalNumber: item.itemInternalNumber,
                        type: item.type?.typeName,
                        category: item.type?.category?.categoryName,
                        itemName: item.itemName,
                        status: item.active ? item.status : CommonConstants.INACTIVE,
                        serialNumber: item.serialNumber,
                        location: item.location?.locationName,
                        deliveryDate: item.deliveryDate
                            ? `${new Date(item.deliveryDate)
                                  .toLocaleDateString('en-GB', {
                                      year: 'numeric',
                                      month: '2-digit',
                                      day: '2-digit'
                                  })
                                  .replaceAll('/', '.')}`
                            : null,
                        issueDate: item.issueDate
                            ? `${new Date(item.issueDate)
                                  .toLocaleDateString('en-GB', {
                                      year: 'numeric',
                                      month: '2-digit',
                                      day: '2-digit'
                                  })
                                  .replaceAll('/', '.')}`
                            : null,
                        issuedTo: item.issuedTo,
                        pieces: item.pieces,
                        piecesStoredIssuedDropped: `${item.piecesStored} / ${item.piecesIssued} / ${item.piecesDropped}`,
                        droppingDate: item.droppingDate
                            ? `${new Date(item.droppingDate)
                                  .toLocaleDateString('en-GB', {
                                      year: 'numeric',
                                      month: '2-digit',
                                      day: '2-digit'
                                  })
                                  .replaceAll('/', '.')}`
                            : null,
                        supplier: item.supplier?.supplierName,
                        department: item.department?.departmentName,
                        lastChangedDate: item.lastChangedDate
                            ? `${new Date(item.lastChangedDate)
                                  .toLocaleDateString('en-GB', {
                                      year: 'numeric',
                                      month: '2-digit',
                                      day: '2-digit',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      second: '2-digit'
                                  })
                                  .replaceAll('/', '.')}`
                            : null,
                        active: item.active
                    }))}
                    autoHeight={true}
                    autoPageSize={true}
                    density="compact"
                    columns={columns}
                    pageSize={75}
                    rowsPerPageOptions={[75]}
                    hideFooterSelectedRowCount
                    components={{ Toolbar: GridToolbar }}
                    onRowClick={(params) => router.push(`/details/${params.id}`)}
                    className={styles.hover}
                />
            </ThemeProvider>
            <Typography
                color={darkGrey}
                marginTop="1em"
            >
                * La / Ag / As ... Lagernd / Ausgegeben / Ausgeschieden (in Stück)
            </Typography>
        </Grid>
    );
};

export default DataTableInventory;
