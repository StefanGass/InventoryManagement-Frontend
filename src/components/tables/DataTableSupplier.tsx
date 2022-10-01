import { FC } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { ThemeProvider } from '@mui/material/styles';
import { ISupplier } from 'components/interfaces';
import { tableTheme } from 'styles/tableTheme';

interface IDataTableSupplierProps {
    supplierList: ISupplier[];
}

const columns: GridColDef[] = [
    { field: 'supplierName', headerName: 'Lieferant', width: 250 },
    { field: 'link', headerName: 'Link', width: 500 }
];

const DataTableSupplier: FC<IDataTableSupplierProps> = (props) => {
    const { supplierList } = props;

    return (
        <ThemeProvider theme={tableTheme}>
            <DataGrid
                rows={supplierList.map((supplier: ISupplier) => ({
                    id: supplier.id,
                    supplierName: supplier.supplierName,
                    link: supplier.link
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

export default DataTableSupplier;
