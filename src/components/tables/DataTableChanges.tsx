import { FC } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { ThemeProvider } from '@mui/material/styles';
import { IChange } from 'components/interfaces';
import { tableTheme } from 'styles/tableTheme';
import { Container, Typography } from '@mui/material';

interface IDataTableChangesProps {
    changeList: IChange[];
}

const columns: GridColDef[] = [
    { field: 'change', headerName: 'Änderung', width: 400 },
    { field: 'user', headerName: 'Geändert durch', width: 250 },
    {
        field: 'date',
        headerName: 'Änderungsdatum',
        width: 200
    }
];

const DataTableChanges: FC<IDataTableChangesProps> = (props) => {
    const { changeList } = props;

    return (
        <ThemeProvider theme={tableTheme}>
            <Container maxWidth={'md'}>
                <Typography
                    variant="h3"
                    align="center"
                    gutterBottom
                >
                    Änderungsverlauf
                </Typography>
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
                                .replaceAll('/', '.')}` ?? ''
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
            </Container>
        </ThemeProvider>
    );
};

export default DataTableChanges;
