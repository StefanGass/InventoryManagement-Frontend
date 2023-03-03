import { FC } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { IType } from 'components/interfaces';

interface IDataTableTypeProps {
    typeList: IType[];
}

const columns: GridColDef[] = [
    { field: 'typeName', headerName: 'Typ', width: 250 },
    { field: 'categoryName', headerName: 'Katgorie', width: 250 }
];

const DataTableType: FC<IDataTableTypeProps> = (props) => {
    const { typeList } = props;

    return (
        <div style={typeList.length < 15 ? { height: 'auto' } : { height: 700 }}>
            <DataGrid
                rows={typeList.map((type: IType) => ({
                    id: type?.id,
                    typeName: type?.typeName,
                    categoryName: type?.category?.categoryName
                }))}
                autoHeight={typeList.length < 15}
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

export default DataTableType;
