import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { ICategory } from 'components/interfaces';
import { Box } from '@mui/material';

interface IDataTableCategoryProps {
    categoryList: ICategory[];
}

const columns: GridColDef[] = [
    { field: 'categoryName', headerName: 'Kategorie', width: 300 },
    { field: 'prefix', headerName: 'Präfix', width: 200 }
];

export default function DataTableCategory(props: IDataTableCategoryProps) {
    const { categoryList } = props;

    return (
        <Box
            style={
                categoryList.length < 15
                    ? { height: 'auto', width: '95%', maxWidth: 505 }
                    : {
                          height: 700,
                          width: '95%',
                          maxWidth: 505
                      }
            }
        >
            <DataGrid
                rows={categoryList.map((category: ICategory) => ({
                    id: category.id,
                    categoryName: category.categoryName,
                    prefix: category.prefix
                }))}
                autoHeight={categoryList.length < 15}
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
