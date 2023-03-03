import { FC } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { IChange } from 'components/interfaces';
import { Container, Typography } from '@mui/material';
import { Box } from '@mui/system';

interface IDataTableChangeProps {
    changeList: IChange[];
}

const columns: GridColDef[] = [
    { field: 'change', headerName: 'Änderung', width: 250 },
    { field: 'user', headerName: 'Geändert durch', width: 200 },
    { field: 'date', headerName: 'Änderungsdatum', width: 200 },
    { field: 'changeHistory', headerName: 'Änderungsverlauf', width: 4000 }
];

const DataTableChange: FC<IDataTableChangeProps> = (props) => {
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
            <div style={changeList.length < 15 ? { height: 'auto' } : { height: 700 }}>
                <DataGrid
                    rows={changeList.map((change: IChange) => ({
                        id: change.id,
                        change: change.changeStatus,
                        user: change.user,
                        date:
                            `${new Date(change.changeDate)
                                .toLocaleDateString('en-GB', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                })
                                .replaceAll('/', '.')}` ?? '',
                        changeHistory: change.changeHistory
                    }))}
                    autoHeight={changeList.length < 15}
                    density="compact"
                    columns={columns}
                    pageSize={50}
                    rowsPerPageOptions={[50]}
                    hideFooterSelectedRowCount
                    components={{ Toolbar: GridToolbar }}
                />
            </div>
        </Container>
    );
};

export default DataTableChange;
