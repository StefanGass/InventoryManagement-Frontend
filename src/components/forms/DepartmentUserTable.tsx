import { IDepartment, IDepartmentMemberConverted } from 'components/interfaces';
import { GridRowId } from '@mui/x-data-grid';
import { Grid } from '@mui/material';
import DataTableUser from 'components/tables/DataTableUser';
import ParameterFormAddDeleteAlert from 'components/alerts/ParameterFormAddDeleteAlert';
import CustomButton from 'components/form-fields/CustomButton';
import { Remove } from '@mui/icons-material';
import { FC, MouseEvent, useEffect, useState } from 'react';

interface IDepartmentUserTable {
    department: IDepartment;
    userList: IDepartmentMemberConverted[];
    fetchAndMergeChosenDepartmentWithUserList: () => void;
    setIsSend: (bool: boolean) => void;
    handleError: () => void;
}

const DepartmentUserTable: FC<IDepartmentUserTable> = (props) => {
    const { userList, fetchAndMergeChosenDepartmentWithUserList, department, setIsSend, handleError } = props;
    const [selectionModelDelete, setSelectionModelDelete] = useState<GridRowId[]>([]);
    const [deleteMemberInputEmptyAlert, setDeleteMemberInputEmptyAlert] = useState(false);
    const [deleteMemberSuccessfulAlert, setDeleteMemberSuccessfulAlert] = useState(false);

    useEffect(() => {
        setSelectionModelDelete([]);
        setDeleteMemberInputEmptyAlert(false);
        setDeleteMemberSuccessfulAlert(false);
    }, [department]);

    useEffect(() => {
        setDeleteMemberInputEmptyAlert(false);
    }, [selectionModelDelete]);

    const onDeleteMemberButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setDeleteMemberSuccessfulAlert(false);
        setDeleteMemberInputEmptyAlert(false);
        if (department && selectionModelDelete.length > 0) {
            selectionModelDelete.forEach((model) => {
                fetch(`${process.env.HOSTNAME}/api/inventorymanagement/department/member/` + department.id, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(model)
                })
                    .then((response) => {
                        if (response.ok) {
                            fetchAndMergeChosenDepartmentWithUserList();
                            setDeleteMemberSuccessfulAlert(true);
                            setIsSend(false);
                        } else {
                            handleError();
                        }
                    })
                    .catch(() => {
                        handleError();
                    });
            });
        } else {
            setDeleteMemberInputEmptyAlert(true);
        }
    };

    return (
        <>
            <Grid
                item
                height="auto"
                width="95%"
                margin="auto"
            >
                <DataTableUser
                    userList={userList}
                    selectionModel={selectionModelDelete}
                    setSelectionModel={setSelectionModelDelete}
                />
            </Grid>
            <ParameterFormAddDeleteAlert
                addSuccessfulAlert={deleteMemberSuccessfulAlert}
                inputEmptyAlert={deleteMemberInputEmptyAlert}
                duplicateErrorAlert={false}
            />
            <Grid
                container
                justifyContent="center"
                marginTop="0.5em"
            >
                <CustomButton
                    onClick={onDeleteMemberButtonClick}
                    label="Entfernen"
                    symbol={<Remove />}
                />
            </Grid>
        </>
    );
};

export default DepartmentUserTable;
