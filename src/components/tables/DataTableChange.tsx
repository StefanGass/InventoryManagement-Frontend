import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { IChange } from 'components/interfaces';
import { Box, Container, Typography } from '@mui/material';

interface IDataTableChangeProps {
    changeList: IChange[];
}

const columns: GridColDef[] = [
    { field: 'change', headerName: 'Änderung', width: 250 },
    { field: 'user', headerName: 'Geändert durch', width: 200 },
    { field: 'date', headerName: 'Änderungsdatum', width: 200 },
    { field: 'changeHistory', headerName: 'Änderungsverlauf', width: 4000 }
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
                        date:
                            `${new Date(change.changeDate).toLocaleDateString('en-CA', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: false
                            })}` ?? null,
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
