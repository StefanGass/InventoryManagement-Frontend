import { FC } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { ISupplier } from 'components/interfaces';

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
        <div style={supplierList.length < 15 ? { height: 'auto' } : { height: 700 }}>
            <DataGrid
                rows={supplierList.map((supplier: ISupplier) => ({
                    id: supplier.id,
                    supplierName: supplier.supplierName,
                    link: supplier.link
                }))}
                autoHeight={supplierList.length < 15}
                density="compact"
                columns={columns}
                pageSize={50}
                rowsPerPageOptions={[50]}
                hideFooterSelectedRowCount
                components={{ Toolbar: GridToolbar }}
            />
        </div>
    );
};

export default DataTableSupplier;
