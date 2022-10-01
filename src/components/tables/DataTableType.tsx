import { FC } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { ThemeProvider } from '@mui/material/styles';
import { IType } from 'components/interfaces';
import { tableTheme } from 'styles/tableTheme';

interface IDataTableTypeProps {
    typeList: IType[];
}

const columns: GridColDef[] = [
    { field: 'typeName', headerName: 'Typ', width: 250 },
    { field: 'categoryName', headerName: 'Katgorie', width: 250 }
];

const DataTableType: FC<IDataTableTypeProps> = (props) => {
    const { typeList } = props;

    return (
        <ThemeProvider theme={tableTheme}>
            <DataGrid
                rows={typeList.map((type: IType) => ({
                    id: type?.id,
                    typeName: type?.typeName,
                    categoryName: type?.category?.categoryName
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

export default DataTableType;
