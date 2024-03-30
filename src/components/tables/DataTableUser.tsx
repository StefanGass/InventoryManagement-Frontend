import { DataGrid, GridColDef, GridRowId, GridToolbar } from '@mui/x-data-grid';
import { IDepartmentMemberConverted } from 'components/interfaces';
import { Box } from '@mui/material';

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

export default function DataTableUser(props: IDataTableUserProps) {
    const { userList, selectionModel, setSelectionModel } = props;
    let sortedUserList = userList.sort((a, b) => (a.name > b.name ? 1 : -1));

    return (
        <Box
            style={
                sortedUserList.length < 15
                    ? { height: 'auto', width: '95%', maxWidth: 500 }
                    : {
                          height: 700,
                          width: '95%',
                          maxWidth: 500
                      }
            }
        >
            <DataGrid
                rows={sortedUserList.map((user: IDepartmentMemberConverted) => ({
                    id: user.id,
                    name: user.name,
                    department: user.department
                }))}
                autoHeight={sortedUserList.length < 15}
                density="compact"
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 50
                        }
                    }
                }}
                pageSizeOptions={[50]}
                hideFooterSelectedRowCount
                checkboxSelection
                rowSelectionModel={selectionModel}
                onRowSelectionModelChange={(selection) => {
                    if (selection.length > 1) {
                        const selectionSet = new Set(selectionModel);
                        const result = selection.filter((s) => !selectionSet.has(s));
                        setSelectionModel(result);
                    } else {
                        setSelectionModel(selection);
                    }
                }}
                slots={{ toolbar: GridToolbar }}
            />
        </Box>
    );
}
