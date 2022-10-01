import { FC } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { ThemeProvider } from '@mui/material/styles';
import { ILocation } from 'components/interfaces';
import { tableTheme } from 'styles/tableTheme';

interface IDataTableLocationProps {
    locationList: ILocation[];
}

const columns: GridColDef[] = [{ field: 'locationName', headerName: 'Standort', width: 400 }];

const DataTableLocation: FC<IDataTableLocationProps> = (props) => {
    const { locationList } = props;

    return (
        <ThemeProvider theme={tableTheme}>
            <DataGrid
                rows={locationList.map((location: ILocation) => ({
                    id: location.id,
                    locationName: location.locationName
                }))}
                autoHeight={true}
                autoPageSize={true}
                density="compact"
                columns={columns}
                pageSize={50}
                rowsPerPageOptions={[50]}
                hideFooterSelectedRowCount
                components={{ Toolbar: GridToolbar }}
            />
        </ThemeProvider>
    );
};

export default DataTableLocation;
