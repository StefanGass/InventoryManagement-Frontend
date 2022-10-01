import { FC } from 'react';
import { DataGrid, GridColDef, GridRowId, GridToolbar } from '@mui/x-data-grid';
import { ThemeProvider } from '@mui/material/styles';
import { IDepartmentMemberConverted } from 'components/interfaces';
import { tableTheme } from 'styles/tableTheme';

interface IDataTableUserProps {
    userList: IDepartmentMemberConverted[];
    selectionModel: GridRowId[];
    setSelectionModel: (val: GridRowId[]) => void;
}

const columns: GridColDef[] = [
    {
        field: 'name',
        headerName: 'Name',
        width: 300
    }
];

const DataTableCategory: FC<IDataTableUserProps> = (props) => {
    const { userList, selectionModel, setSelectionModel } = props;

    return (
        <ThemeProvider theme={tableTheme}>
            <DataGrid
                rows={userList.map((user: IDepartmentMemberConverted) => ({
                    id: user.id,
                    name: user.name,
                    department: user.department
                }))}
                autoHeight={true}
                autoPageSize={true}
                density="compact"
                columns={columns}
                pageSize={50}
                rowsPerPageOptions={[50]}
                hideFooterSelectedRowCount
                checkboxSelection
                selectionModel={selectionModel}
                onSelectionModelChange={(selection) => {
                    if (selection.length > 1) {
                        const selectionSet = new Set(selectionModel);
                        const result = selection.filter((s) => !selectionSet.has(s));
                        setSelectionModel(result);
                    } else {
                        setSelectionModel(selection);
                    }
                }}
                components={{ Toolbar: GridToolbar }}
            />
        </ThemeProvider>
    );
};

export default DataTableCategory;
