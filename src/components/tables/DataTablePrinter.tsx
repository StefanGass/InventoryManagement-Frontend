import { FC } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { IPrinter } from 'components/interfaces';

interface IDataTablePrinterProps {
    printerList: IPrinter[];
}

const columns: GridColDef[] = [
    { field: 'printerName', headerName: 'Drucker', width: 200 },
    { field: 'printerIp', headerName: 'IP-Adresse', width: 170 },
    { field: 'printerModel', headerName: 'Modell', width: 150 },
    { field: 'labelFormat', headerName: 'Label-Format', width: 150 }
];

const DataTableCategory: FC<IDataTablePrinterProps> = (props) => {
    const { printerList } = props;

    return (
        <div style={printerList.length < 15 ? { height: 'auto' } : { height: 700 }}>
            <DataGrid
                rows={printerList.map((printer: IPrinter) => ({
                    id: printer.id,
                    printerName: printer.printerName,
                    printerIp: printer.printerIp,
                    printerModel: printer.printerModel,
                    labelFormat: printer.labelFormat
                }))}
                autoHeight={printerList.length < 15}
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

export default DataTableCategory;
