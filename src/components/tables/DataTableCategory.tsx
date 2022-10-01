import { FC } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { ThemeProvider } from '@mui/material/styles';
import { ICategory } from 'components/interfaces';
import { tableTheme } from 'styles/tableTheme';

interface IDataTableCategoryProps {
    categoryList: ICategory[];
}

const columns: GridColDef[] = [{ field: 'categoryName', headerName: 'Kategorie', width: 400 }];

const DataTableCategory: FC<IDataTableCategoryProps> = (props) => {
    const { categoryList } = props;

    return (
        <ThemeProvider theme={tableTheme}>
            <DataGrid
                rows={categoryList.map((category: ICategory) => ({
                    id: category.id,
                    categoryName: category.categoryName
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

export default DataTableCategory;
