import { FC } from 'react';
import { DataGrid, GridColDef, GridRowId, GridToolbar } from '@mui/x-data-grid';
import { IDepartmentMemberConverted } from 'components/interfaces';

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
    let sortedUserList = userList.sort((a, b) => (a.name > b.name ? 1 : -1));

    return (
        <div style={sortedUserList.length < 15 ? { height: 'auto' } : { height: 700 }}>
            <DataGrid
                rows={sortedUserList.map((user: IDepartmentMemberConverted) => ({
                    id: user.id,
                    name: user.name,
                    department: user.department
                }))}
                autoHeight={sortedUserList.length < 15}
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
        </div>
    );
};

export default DataTableCategory;
