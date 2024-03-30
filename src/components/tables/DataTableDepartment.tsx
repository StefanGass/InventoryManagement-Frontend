import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { IDepartment } from 'components/interfaces';
import { Box } from '@mui/material';

interface IDataTableDepartmentProps {
    departmentList: IDepartment[];
}

const columns: GridColDef[] = [{ field: 'departmentName', headerName: 'Abteilung', width: 400 }];

export default function DataTableDepartment(props: IDataTableDepartmentProps) {
    const { departmentList } = props;

    return (
        <Box style={departmentList.length < 15 ? { height: 'auto', width: '95%', maxWidth: 505 } : { height: 700, width: '95%', maxWidth: 505 }}>
            <DataGrid
                rows={departmentList.map((department: IDepartment) => ({
                    id: department.id,
                    departmentName: department.departmentName
                }))}
                autoHeight={departmentList.length < 15}
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
                slots={{ toolbar: GridToolbar }}
            />
        </Box>
    );
}
