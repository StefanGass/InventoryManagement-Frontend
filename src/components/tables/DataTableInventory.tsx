import { FC, useState } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { Box, Chip, Grid, Typography } from '@mui/material';
import { IDataTableInventory, IDetailInventoryItem } from "components/interfaces";
import CommonConstants from 'utils/CommonConstants';
import { darkGrey } from 'styles/theme';
import { useRouter } from 'next/router';
import styles from 'styles/DataTableInventory.module.scss';
import SearchForm from 'components/forms/inventory-form/SearchForm';
import LoadingSpinner from "components/layout/LoadingSpinner";

const getColour = (param: string) => {
    switch (param) {
        case CommonConstants.LAGERND:
            return 'success';
        case CommonConstants.AUSGEGEBEN:
            return 'info';
        case CommonConstants.AUSGESCHIEDEN:
            return 'error';
        case CommonConstants.INAKTIV:
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
            return (
                <Chip
                    label={params.value}
                    color={getColour(params.value)}
                    size="small"
                />
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
    { field: 'lastChangedDate', headerName: 'Letzte Änderung', width: 160 }
];
const droppingInformationsColumns:GridColDef[]= [
    { field: 'droppingQueue', headerName: 'Art', width: 160 },
    { field: 'droppingQueuePieces', headerName: 'Auszusch. Anzahl', width: 140 },
    { field: 'droppingQueueDate', headerName: 'Auszusch. Datum', width: 140 },
    { field: 'droppingQueueReason', headerName: 'Auszusch. Grund', width: 160 }
]

const DataTableInventory: FC<IDataTableInventory> = (props) => {
    const {
        items,
        setSearch,
        showSearchBar,
        showSwitchAndLegend,
        searching,
        includeDroppingInformation,
        selectionModel,
        setSelectionModel
    } = props;

    const [checkedDropped, setStateDropped] = useState(false);
    const [checkedInactive, setStateInactive] = useState(false);
    const router = useRouter();

    const handleChangeDroppedItems = (event: { target: { checked: boolean | ((prevState: boolean) => boolean) } }) => {
        setStateDropped(event.target.checked);
    };

    const handleChangeInactiveItems = (event: { target: { checked: boolean | ((prevState: boolean) => boolean) } }) => {
        setStateInactive(event.target.checked);
    };

    return (
        <Grid
            item
            width="95%"
            margin="auto"
        >
            {showSwitchAndLegend && (
                <Grid>
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
                </Grid>
            )}
            {showSearchBar && (
                <>
                    <SearchForm setSearch={setSearch} items={items} />
                    <Box sx={{ my: 2 }} />
                </>
            )}
            <div  style={items.length < 15 ? { height: 700, filter: searching?'blur(3px)':'' } : { height: 700,filter: searching?'blur(3px)':'' }}>
                <div style={{height:700,position:"relative"}}>
                        {searching? (
                            <div style={{position:"absolute",top:0,left:0,
                                height: '100%',width:'100%' }}>
                                <LoadingSpinner></LoadingSpinner>
                            </div>
                        ):(<></>)}
                    <DataGrid
                        rows={items.filter(item => {
                            if(showSwitchAndLegend && !checkedDropped && item.pieces === item.piecesDropped){
                                return false;
                            }else if(showSwitchAndLegend && !checkedInactive && !item.active){
                                return false;
                            }
                            return true;
                        } ).map((item: IDetailInventoryItem) => ({
                            id: item.id,
                            itemInternalNumber: item.itemInternalNumber,
                            category: item.type?.category?.categoryName,
                            type: item.type?.typeName,
                            itemName: item.itemName,
                            status: item.active ? item.status : CommonConstants.INAKTIV,
                            location: item.location?.locationName,
                            pieces: item.pieces,
                            piecesStoredIssuedDropped: `${item.piecesStored} / ${item.piecesIssued} / ${item.piecesDropped}`,
                            oldItemNumber: item.oldItemNumber,
                            serialNumber: item.serialNumber,
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
                            active: item.active,
                            droppingQueue:item.droppingQueue,
                            droppingQueueDate:item.droppingQueueDate
                                ? `${new Date(item.droppingQueueDate)
                                    .toLocaleDateString('en-GB', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit'
                                    })
                                    .replaceAll('/', '.')}`
                                : null,
                            droppingQueueReason:item.droppingQueueReason,
                            droppingQueuePieces:item.droppingQueuePieces
                        }))}
                        autoHeight={items.length < 15}
                        density="compact"
                        columns={includeDroppingInformation?[...columns,...droppingInformationsColumns]:columns}
                        pageSize={100}
                        rowsPerPageOptions={[100]}
                        hideFooterSelectedRowCount
                        components={{ Toolbar: GridToolbar }}
                        onRowClick={(params) => router.push(`/details/${params.id}`)}
                        className={styles.hover}
                        checkboxSelection={!!selectionModel}
                        selectionModel={selectionModel}
                        onSelectionModelChange={(selection) => {
                            if(setSelectionModel)
                                setSelectionModel(selection);
                        }}
                    />
                </div>

            </div>
            {showSwitchAndLegend && (
                <Typography
                    color={darkGrey}
                    marginTop="1em"
                >
                    * La / Ag / As ... Lagernd / Ausgegeben / Ausgeschieden (in Stück)
                </Typography>
            )}
        </Grid>
    );
};

export default DataTableInventory;
