import { IDepartment, IDepartmentMemberConverted } from 'components/interfaces';
import { GridRowId } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import DataTableUser from 'components/tables/DataTableUser';
import CustomButton from 'components/form-fields/CustomButton';
import { Remove } from '@mui/icons-material';
import { MouseEvent, useEffect, useState } from 'react';
import CustomAlert from 'components/form-fields/CustomAlert';

interface IDepartmentUserTable {
    department?: IDepartment;
    userList: IDepartmentMemberConverted[];
    fetchAndMergeChosenDepartmentWithUserList: () => void;
    getRemoveCall: (department: IDepartment | null, member: GridRowId) => Promise<any>;
    setIsSend: (bool: boolean) => void;
    isDepartmentRequiredForFetch: boolean;
    handleError: () => void;
}

export default function DepartmentUserTableForm(props: IDepartmentUserTable) {
    const { userList, fetchAndMergeChosenDepartmentWithUserList, department, setIsSend, isDepartmentRequiredForFetch, handleError, getRemoveCall } = props;
    const [selectionModelDelete, setSelectionModelDelete] = useState<GridRowId[]>([]);
    const [isDeleteMemberInputEmptyAlert, setIsDeleteMemberInputEmptyAlert] = useState(false);
    const [isDeleteMemberSuccessfulAlert, setIsDeleteMemberSuccessfulAlert] = useState(false);

    useEffect(() => {
        setSelectionModelDelete([]);
        setIsDeleteMemberInputEmptyAlert(false);
        setIsDeleteMemberSuccessfulAlert(false);
    }, [department]);

    useEffect(() => {
        setIsDeleteMemberInputEmptyAlert(false);
        if (selectionModelDelete.length !== 0) {
            setIsDeleteMemberSuccessfulAlert(false);
        }
    }, [selectionModelDelete]);

    function onDeleteMemberButtonClick(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setIsDeleteMemberSuccessfulAlert(false);
        setIsDeleteMemberInputEmptyAlert(false);
        if ((!isDepartmentRequiredForFetch || department) && selectionModelDelete.length > 0) {
            selectionModelDelete.forEach((model) => {
                getRemoveCall(department ? department : null, model)
                    .then((response) => {
                        fetchAndMergeChosenDepartmentWithUserList();
                        setIsDeleteMemberSuccessfulAlert(true);
                        setIsSend(false);
                    })
                    .catch(() => {
                        handleError();
                    });
            });
        } else {
            setIsDeleteMemberInputEmptyAlert(true);
        }
    }

    return (
        <>
            <DataTableUser
                userList={userList}
                selectionModel={selectionModelDelete}
                setSelectionModel={setSelectionModelDelete}
            />
            {isDeleteMemberSuccessfulAlert && (
                <CustomAlert
                    state="success"
                    message="Benutzer:in(nen) erfolgreich entfernt!"
                />
            )}
            {isDeleteMemberInputEmptyAlert && (
                <CustomAlert
                    state="error"
                    message="Mindestens ein:e Benutzer:in auswählen!"
                />
            )}
            <Box my={1} />
            <CustomButton
                onClick={onDeleteMemberButtonClick}
                label="Entfernen"
                symbol={<Remove />}
            />
        </>
    );
}
