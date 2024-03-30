import { useContext, useEffect, useState } from 'react';
import { IDepartmentMember, IDepartmentMemberConverted } from 'components/interfaces';
import userManagementService from 'service/userManagementService';
import DepartmentUserTableForm from 'components/forms/DepartmentUserTableForm';
import LoadingSpinner from 'components/layout/LoadingSpinner';
import ErrorInformation from 'components/layout/ErrorInformation';
import inventoryManagementService from 'service/inventoryManagementService';
import CustomAutocomplete from 'components/form-fields/CustomAutocomplete';
import CustomAlert from 'components/form-fields/CustomAlert';
import CustomButton from 'components/form-fields/CustomButton';
import { Add } from '@mui/icons-material';
import { UserContext } from '../../../pages/_app';
import CustomHeading2 from 'components/layout/CustomHeading2';
import { Box } from '@mui/material';

export default function ParameterFormDroppingReviewer() {
    const { authHeaders, userId } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [users, setUsers] = useState<IDepartmentMemberConverted[]>([]);
    const [departmentMember, setDepartmentMember] = useState<IDepartmentMember[]>([]);

    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [addMessage, setAddMessage] = useState<'DUPLICATE' | 'SUCCESS' | 'ERROR' | null>(null);

    function handleError() {
        setIsLoading(false);
        setIsError(true);
    }

    function addUser() {
        setAddMessage(null);
        if (!selectedUser) {
            setAddMessage('ERROR');
            return;
        }
        const member = departmentMember.find((x) => x.userId == selectedUser.id);
        if (member?.droppingReviewer) {
            setAddMessage('DUPLICATE');
            return;
        }
        updateReviewer(member, true, true);
    }

    function updateReviewer(member: IDepartmentMember | undefined, isReviewer: boolean, isShowSuccessAlert: boolean) {
        if (member) {
            return inventoryManagementService
                .updateReviewer(member.userId, isReviewer)
                .then(() => {
                    member.droppingReviewer = isReviewer;
                    setDepartmentMember([...departmentMember]);
                    isShowSuccessAlert && setAddMessage('SUCCESS');
                })
                .catch(() => handleError());
        }
        return new Promise<void>(() => Promise.resolve());
    }

    useEffect(() => {
        setIsLoading(true);
        userManagementService
            .getAllUsers(userId, authHeaders)
            .then((result) => {
                const users = userManagementService.convertUserToDepartmentMemberConverted(result);

                inventoryManagementService
                    .getAllDepartments()
                    .then((departments) => {
                        const member: IDepartmentMember[] = [];
                        departments.forEach((department) => {
                            if (department.departmentMembers) {
                                department.departmentMembers.forEach((m) => {
                                    const user = users.find((u) => u.id === m.userId);
                                    if (user) {
                                        user.name += ` (${department.departmentName})`;
                                    }
                                });
                                member.push(...department.departmentMembers);
                            }
                        });
                        setDepartmentMember(member);
                        setUsers(users);
                        setIsLoading(false);
                    })
                    .catch(() => handleError());
            })
            .catch(() => handleError());
    }, []);

    return (
        <>
            {isLoading ? (
                <LoadingSpinner />
            ) : isError ? (
                <ErrorInformation />
            ) : (
                <>
                    <CustomHeading2 text="Berechtigung hinzufügen" />
                    <Box my={0.5} />
                    <CustomAutocomplete
                        options={users.filter((x) => departmentMember.some((m) => !m.droppingReviewer && x.id === m.userId))}
                        optionKey="name"
                        label="Benutzer:in"
                        setValue={(val) => {
                            setSelectedUser(val);
                            setAddMessage(null);
                        }}
                        isError={false}
                    />
                    <CustomAlert
                        state="warning"
                        message="ACHTUNG: Nach dem Hinzufügen oder Entfernen muss der:die betroffene Benutzer:in die Seite neu laden!"
                    />
                    <CustomButton
                        onClick={() => addUser()}
                        label="Hinzufügen"
                        symbol={<Add />}
                    />
                    {addMessage === 'SUCCESS' && (
                        <CustomAlert
                            state="success"
                            message="Benutzer:in erfolgreich hinzugefügt!"
                        />
                    )}
                    {addMessage === 'ERROR' && (
                        <CustomAlert
                            state="error"
                            message="Mindestens ein:e Benutzer:in auswählen!"
                        />
                    )}
                    {addMessage === 'DUPLICATE' && (
                        <CustomAlert
                            state="error"
                            message="Benutzer:in wurde bereits hinzugefügt!"
                        />
                    )}
                    <Box my={1.5} />
                    <CustomHeading2 text="Berechtigung entziehen" />
                    <Box my={1} />
                    <DepartmentUserTableForm
                        userList={users.filter((memberConverted) =>
                            departmentMember.some((member) => memberConverted.id == member.userId && member.droppingReviewer)
                        )}
                        fetchAndMergeChosenDepartmentWithUserList={() => {}}
                        setIsSend={() => {}}
                        handleError={() => handleError()}
                        isDepartmentRequiredForFetch={false}
                        getRemoveCall={(department, row) => {
                            setAddMessage(null);
                            const member = departmentMember.find((member) => member.userId == row);
                            return updateReviewer(member, false, false);
                        }}
                    />
                </>
            )}
        </>
    );
}
