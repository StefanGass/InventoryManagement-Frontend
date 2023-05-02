import { IDepartment, IDepartmentMemberConverted } from 'components/interfaces';
import { GridRowId } from '@mui/x-data-grid';
import { Grid } from '@mui/material';
import DataTableUser from 'components/tables/DataTableUser';
import CustomButton from 'components/form-fields/CustomButton';
import { Remove } from '@mui/icons-material';
import { FC, MouseEvent, useEffect, useState } from 'react';
import CustomAlert from 'components/form-fields/CustomAlert';

interface IDepartmentUserTable {
    department?: IDepartment;
    userList: IDepartmentMemberConverted[];
    fetchAndMergeChosenDepartmentWithUserList: () => void;
    getRemoveCall: (department:IDepartment ,member:GridRowId) => Promise<any>;
    setIsSend: (bool: boolean) => void;
    handleError: () => void;
}

const DepartmentUserTableForm: FC<IDepartmentUserTable> = (props) => {
    const { userList, fetchAndMergeChosenDepartmentWithUserList, department, setIsSend, handleError,getRemoveCall } = props;
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
                getRemoveCall(department,model)
                    .then((response) => {
                            fetchAndMergeChosenDepartmentWithUserList();
                            setDeleteMemberSuccessfulAlert(true);
                            setIsSend(false);
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
            {deleteMemberSuccessfulAlert && (
                <CustomAlert
                    state="success"
                    message="User:in(nen) erfolgreich entfernt!"
                />
            )}
            {deleteMemberInputEmptyAlert && (
                <CustomAlert
                    state="error"
                    message="Mindestens ein:e User:in auswählen!"
                />
            )}
            <Grid
                container
                justifyContent="center"
                marginTop="0.5em"
            >
                <CustomButton
                    onClick={onDeleteMemberButtonClick}
                    label="Entfernen"
                    id="entfernenButton"
                    symbol={<Remove />}
                />
            </Grid>
        </>
    );
};

export default DepartmentUserTableForm;
