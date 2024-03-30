import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { ILocation } from 'components/interfaces';
import { Box } from '@mui/material';

interface IDataTableLocationProps {
    locationList: ILocation[];
}

const columns: GridColDef[] = [{ field: 'locationName', headerName: 'Standort', width: 400 }];

export default function DataTableLocation(props: IDataTableLocationProps) {
    const { locationList } = props;

    return (
        <Box
            style={
                locationList.length < 15
                    ? { height: 'auto', width: '95%', maxWidth: 505 }
                    : {
                          height: 700,
                          width: '95%',
                          maxWidth: 505
                      }
            }
        >
            <DataGrid
                rows={locationList.map((location: ILocation) => ({
                    id: location.id,
                    locationName: location.locationName
                }))}
                autoHeight={locationList.length < 15}
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
    );
}
