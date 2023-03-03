import { FC } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { ILocation } from 'components/interfaces';

interface IDataTableLocationProps {
    locationList: ILocation[];
}

const columns: GridColDef[] = [{ field: 'locationName', headerName: 'Standort', width: 400 }];

const DataTableLocation: FC<IDataTableLocationProps> = (props) => {
    const { locationList } = props;

    return (
        <div style={locationList.length < 15 ? { height: 'auto' } : { height: 700 }}>
            <DataGrid
                rows={locationList.map((location: ILocation) => ({
                    id: location.id,
                    locationName: location.locationName
                }))}
                autoHeight={locationList.length < 15}
                density="compact"
                columns={columns}
                pageSize={50}
                rowsPerPageOptions={[50]}
                hideFooterSelectedRowCount
                components={{ Toolbar: GridToolbar }}
            />
        </div>
    );
};

export default DataTableLocation;
