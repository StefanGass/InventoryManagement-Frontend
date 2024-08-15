import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { IPrinter } from 'components/interfaces';
import { Box } from '@mui/material';

interface IDataTablePrinterProps {
    printerList: IPrinter[];
}

const columns: GridColDef[] = [
    { field: 'printerName', headerName: 'Drucker', width: 200, type: 'string' },
    { field: 'printerIp', headerName: 'IP-Adresse', width: 170, type: 'string' },
    { field: 'printerModel', headerName: 'Modell', width: 150, type: 'string' },
    { field: 'labelFormat', headerName: 'Label-Format', width: 150, type: 'string' }
];

export default function DataTableCategory(props: IDataTablePrinterProps) {
    const { printerList } = props;

    return (
        <Box
            style={
                printerList.length < 15
                    ? { height: 'auto', width: '95%', maxWidth: 700 }
                    : {
                          height: 700,
                          width: '95%',
                          maxWidth: 700
                      }
            }
        >
            <DataGrid
                rows={printerList.map((printer: IPrinter) => ({
                    id: printer.id,
                    printerName: printer.printerName,
                    printerIp: printer.printerIp.slice(6), // remove the leading 'tcp://'
                    printerModel: printer.printerModel,
                    labelFormat: printer.labelFormat
                }))}
                autoHeight={printerList.length < 15}
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
