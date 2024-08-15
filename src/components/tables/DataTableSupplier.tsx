import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { ISupplier } from 'components/interfaces';
import { Box } from '@mui/material';

interface IDataTableSupplierProps {
    supplierList: ISupplier[];
}

const columns: GridColDef[] = [
    { field: 'supplierName', headerName: 'Lieferant', width: 250, type: 'string' },
    { field: 'link', headerName: 'Link', width: 500, type: 'string' }
];

export default function DataTableSupplier(props: IDataTableSupplierProps) {
    const { supplierList } = props;

    return (
        <Box
            style={
                supplierList.length < 15
                    ? { height: 'auto', width: '95%', maxWidth: 505 }
                    : {
                          height: 700,
                          width: '95%',
                          maxWidth: 505
                      }
            }
        >
            <DataGrid
                rows={supplierList.map((supplier: ISupplier) => ({
                    id: supplier.id,
                    supplierName: supplier.supplierName,
                    link: supplier.link
                }))}
                autoHeight={supplierList.length < 15}
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
