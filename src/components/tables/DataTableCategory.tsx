import { FC } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { ICategory } from 'components/interfaces';

interface IDataTableCategoryProps {
    categoryList: ICategory[];
}

const columns: GridColDef[] = [
    { field: 'categoryName', headerName: 'Kategorie', width: 300 },
    { field: 'prefix', headerName: 'Präfix', width: 200 }
];

const DataTableCategory: FC<IDataTableCategoryProps> = (props) => {
    const { categoryList } = props;

    return (
        <div style={categoryList.length < 15 ? { height: 'auto' } : { height: 700 }}>
            <DataGrid
                rows={categoryList.map((category: ICategory) => ({
                    id: category.id,
                    categoryName: category.categoryName,
                    prefix: category.prefix
                }))}
                autoHeight={categoryList.length < 15}
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
