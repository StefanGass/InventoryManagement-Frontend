import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { IType } from 'components/interfaces';
import { Box } from '@mui/material';

interface IDataTableTypeProps {
    typeList: IType[];
}

const columns: GridColDef[] = [
    { field: 'typeName', headerName: 'Typ', width: 250 },
    { field: 'categoryName', headerName: 'Kategorie', width: 250 }
];

export default function DataTableType(props: IDataTableTypeProps) {
    const { typeList } = props;

    return (
        <Box
            style={
                typeList.length < 15
                    ? { height: 'auto', width: '95%', maxWidth: 505 }
                    : {
                          height: 700,
                          width: '95%',
                          maxWidth: 505
                      }
            }
        >
            <DataGrid
                rows={typeList.map((type: IType) => ({
                    id: type?.id,
                    typeName: type?.typeName,
                    categoryName: type?.category?.categoryName
                }))}
                autoHeight={typeList.length < 15}
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
