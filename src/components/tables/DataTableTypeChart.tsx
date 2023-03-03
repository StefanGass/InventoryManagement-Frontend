import { FC } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Grid } from '@mui/material';
import { IChartItem } from 'components/interfaces';

interface IDataTableTypeChartProps {
    chartItemList: IChartItem[];
}

const columns: GridColDef[] = [
    { field: 'type', headerName: 'Typ', width: 200 },
    { field: 'category', headerName: 'Kategorie', width: 140 },
    { field: 'pieces', headerName: 'Stück gesamt', width: 120 },
    { field: 'piecesStored', headerName: 'lagernd', width: 100 },
    { field: 'piecesIssued', headerName: 'ausgegeben', width: 100 },
    { field: 'piecesDropped', headerName: 'ausgeschieden', width: 100 },
    { field: 'locations', headerName: 'Standort(e)', width: 400 },
    { field: 'departments', headerName: 'Abteilung(en)', width: 300 }
];

const DataTableInventory: FC<IDataTableTypeChartProps> = (props) => {
    const { chartItemList } = props;

    return (
        <Grid
            item
            width="95%"
            margin="auto"
        >
            <div style={chartItemList.length < 15 ? { height: 'auto' } : { height: 700 }}>
                <DataGrid
                    rows={chartItemList.map((item: IChartItem) => ({
                        id: item.id,
                        type: item.type?.typeName,
                        category: item.type?.category?.categoryName,
                        pieces: item.pieces,
                        piecesStored: item.piecesStored,
                        piecesIssued: item.piecesIssued,
                        piecesDropped: item.piecesDropped,
                        locations: item.locations,
                        departments: item.departments
                    }))}
                    autoHeight={chartItemList.length < 15}
                    density="compact"
                    columns={columns}
                    pageSize={75}
                    rowsPerPageOptions={[75]}
                    hideFooterSelectedRowCount
                    components={{ Toolbar: GridToolbar }}
                />
            </div>
        </Grid>
    );
};

export default DataTableInventory;
