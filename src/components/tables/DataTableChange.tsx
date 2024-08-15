import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { IChange } from 'components/interfaces';
import { Box, Container, Typography } from '@mui/material';
import { format } from 'date-fns';

interface IDataTableChangeProps {
    changeList: IChange[];
}

const columns: GridColDef[] = [
    { field: 'change', headerName: 'Änderung', width: 250, type: 'string' },
    { field: 'user', headerName: 'Geändert durch', width: 200, type: 'string' },
    {
        field: 'date',
        headerName: 'Änderungsdatum',
        width: 200,
        type: 'dateTime',
        renderCell: (params: GridRenderCellParams<Date>) => {
            return params.value ? format(params.value, 'dd.MM.yyyy, HH:mm') : '';
        }
    },
    { field: 'changeHistory', headerName: 'Änderungsverlauf', width: 4000, type: 'string' }
];

export default function DataTableChange(props: IDataTableChangeProps) {
    const { changeList } = props;

    return (
        <Container maxWidth={'md'}>
            <Typography
                variant="h3"
                align="center"
                gutterBottom
            >
                Änderungsverlauf
            </Typography>
            <Box sx={{ my: 2 }} />
            <Box style={changeList.length < 15 ? { height: 'auto' } : { height: 700 }}>
                <DataGrid
                    rows={changeList.map((change: IChange) => ({
                        id: change.id,
                        change: change.changeStatus,
                        user: change.user,
                        date: change.changeDate ? new Date(change.changeDate) : null,
                        changeHistory: change.changeHistory
                    }))}
                    autoHeight={changeList.length < 15}
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
        </Container>
    );
}
