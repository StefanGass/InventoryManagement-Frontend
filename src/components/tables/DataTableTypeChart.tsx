import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Box, Grid } from '@mui/material';
import { IChartItem } from 'components/interfaces';

interface IDataTableTypeChartProps {
    chartItemList: IChartItem[];
}

const columns: GridColDef[] = [
    { field: 'type', headerName: 'Typ', width: 200, type: 'string' },
    { field: 'category', headerName: 'Kategorie', width: 140, type: 'string' },
    { field: 'pieces', headerName: 'Stück gesamt', width: 120, type: 'number' },
    { field: 'piecesStored', headerName: 'Stk. lagernd', width: 120, type: 'number' },
    { field: 'piecesIssued', headerName: 'Stk. ausgegeb.', width: 120, type: 'number' },
    { field: 'piecesDropped', headerName: 'Stk. ausgesch.', width: 120, type: 'number' },
    { field: 'locations', headerName: 'Standort(e)', width: 450, type: 'string' },
    { field: 'departments', headerName: 'Abteilung(en)', width: 350, type: 'string' }
];

export default function DataTableInventory(props: IDataTableTypeChartProps) {
    const { chartItemList } = props;

    return (
        <Grid
            item
            width="95%"
            margin="auto"
        >
            <Box style={chartItemList.length < 15 ? { height: 'auto' } : { height: 700 }}>
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
                />
            </Box>
        </Grid>
    );
}
