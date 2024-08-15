import { IDepartment, IDepartmentMember, IDepartmentMemberConverted, IObjectToSend, IUser } from 'components/interfaces';
import { MouseEvent, useContext, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import CustomAutocomplete from 'components/form-fields/CustomAutocomplete';
import { Add } from '@mui/icons-material';
import CustomButton from 'components/form-fields/CustomButton';
import useIsFirstRender from 'hooks/useIsFirstRender';
import useFormValidation from 'hooks/useFormValidation';
import DepartmentUserTableForm from 'components/forms/DepartmentUserTableForm';
import CustomAlert from 'components/form-fields/CustomAlert';
import userManagementService from 'service/userManagementService';
import inventoryManagementService from 'service/inventoryManagementService';
import { UserContext } from '../../../pages/_app';
import CustomHeading2 from 'components/layout/CustomHeading2';

interface IParameterFormDepartmentProps {
    userId: number;
    departmentList: IDepartment[];
    isAddNewDepartmentSuccessfulAlert: boolean;
    isAddNewDepartmentDuplicateErrorAlert: boolean;
    onClick: (e: MouseEvent<HTMLButtonElement>, objectToSend: IObjectToSend | null, tableToFetch: string) => void;
    setIsLoading: (bool: boolean) => void;
    setIsServerError: (bool: boolean) => void;
    setIsAddNewDepartmentSuccessfulAlert: (bool: boolean) => void;
    setIsAddNewDepartmentDuplicateErrorAlert: (bool: boolean) => void;
}

const defaultForm: { department: IDepartment | null; user: IUser | null } = {
    department: null,
    user: null
};

const defaultValidation = [{ name: 'user', error: false }];

export default function ParameterFormDepartment(props: IParameterFormDepartmentProps) {
    const { userId, departmentList, setIsLoading, setIsServerError } = props;
    const { authHeaders } = useContext(UserContext);

    const [form, setForm] = useState(JSON.parse(JSON.stringify(defaultForm)));
    const [formValidation, setFormValidation] = useState(JSON.parse(JSON.stringify(defaultValidation)));
    const [isSend, setIsSend] = useState(false);
    const [isAddMemberSuccessfulAlert, setIsAddMemberSuccessfulAlert] = useState(false);
    const [isAddMemberDuplicateErrorAlert, setIsAddMemberDuplicateErrorAlert] = useState(false);

    const [allUserList, setAllUserList] = useState<IUser[]>([]);
    const [usersToChooseFrom, setUsersToChooseFrom] = useState<IDepartmentMemberConverted[]>([]);
    const [userOptionsList, setUserOptionsList] = useState<IDepartmentMemberConverted[]>([]);

    const isFirstRender = useIsFirstRender();

    function handleError() {
        setIsServerError(true);
        setIsLoading(false);
    }

    useEffect(() => {
        setIsAddMemberSuccessfulAlert(false);
        setIsAddMemberDuplicateErrorAlert(false);
        if (!isFirstRender && isSend) {
            useFormValidation(form, formValidation, setFormValidation);
        }
    }, [form.user]);

    useEffect(() => {
        setIsAddMemberSuccessfulAlert(false);
        setIsAddMemberDuplicateErrorAlert(false);
        if (!isFirstRender) {
            setIsLoading(true);
            fetchAndMergeChosenDepartmentWithUserList();
            setIsLoading(false);
            setFormValidation(JSON.parse(JSON.stringify(defaultValidation)));
        }
    }, [form.department]);

    useEffect(() => {
        userManagementService
            .getAllUsers(userId, authHeaders)
            .then((result) => {
                setAllUserList(result);
                setUsersToChooseFrom(userManagementService.convertUserToDepartmentMemberConverted(result));
                setIsLoading(false);
            })
            .catch(() => {
                handleError();
            });
    }, []);

    const mergeUserListWithDepartmentMemberList = (departmentMemberList: IDepartmentMember[], allUserList: IUser[]) => {
        let mergedUserList: IDepartmentMemberConverted[] = [];
        departmentMemberList.map((departmentMember) => {
            allUserList.map((user) => {
                if (departmentMember.userId === user.id && form.department) {
                    mergedUserList.push({
                        id: user.id,
                        name: user.lastName + ' ' + user.firstName,
                        department: form.department as IDepartment
                    });
                }
            });
        });
        return mergedUserList;
    };

    function fetchAndMergeChosenDepartmentWithUserList() {
        if (form.department) {
            fetch(`${process.env.HOSTNAME}/api/inventorymanagement/department/` + form.department.id, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
                .then((response) => {
                    if (response.ok) {
                        response
                            .json()
                            .then((result: IDepartmentMember[]) => {
                                let departmentMemberList: IDepartmentMemberConverted[] = mergeUserListWithDepartmentMemberList(result, allUserList);
                                setUserOptionsList(departmentMemberList);
                            })
                            .catch(() => {
                                handleError();
                            });
                    } else {
                        handleError();
                    }
                })
                .catch(() => {
                    handleError();
                });
        }
    }

    function onAddMemberButtonClick(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        useFormValidation(form, formValidation, setFormValidation);
        setIsAddMemberSuccessfulAlert(false);
        setIsAddMemberDuplicateErrorAlert(false);
        setIsSend(true);
        if (form.department?.id && form.user?.id) {
            fetch(`${process.env.HOSTNAME}/api/inventorymanagement/department/member/` + form.department.id, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form.user.id)
            })
                .then((response) => {
                    if (response.ok) {
                        fetchAndMergeChosenDepartmentWithUserList();
                        setIsAddMemberSuccessfulAlert(true);
                    } else {
                        setIsAddMemberDuplicateErrorAlert(true);
                    }
                })
                .catch(() => {
                    handleError();
                });
        }
    }

    return (
        <>
            <CustomHeading2 text="Abteilung wählen" />
            <Box my={0.5} />
            <CustomAutocomplete
                options={departmentList}
                optionKey="departmentName"
                label="Abteilung"
                setValue={(val) => setForm((oldForm) => ({ ...oldForm, department: val as IDepartment }))}
                value={form.department?.departmentName ?? ''}
                isError={false}
            />
            {form.department && (
                <>
                    <Box my={1.5} />
                    <CustomHeading2 text="Benutzer:in zu Abteilung hinzufügen" />
                    <Box my={0.5} />
                    <CustomAutocomplete
                        options={usersToChooseFrom}
                        optionKey="name"
                        label="Benutzer:in"
                        setValue={(val) => setForm((oldForm) => ({ ...oldForm, user: val as IUser }))}
                        isError={formValidation.some((field) => field.error) ?? false}
                    />
                    <CustomAlert
                        state="warning"
                        message="ACHTUNG: Nach dem Hinzufügen oder Entfernen muss der:die betroffene Benutzer:in die Seite neu laden!"
                    />
                    {isAddMemberSuccessfulAlert && (
                        <CustomAlert
                            state="success"
                            message="Benutzer:in erfolgreich hinzugefügt!"
                        />
                    )}
                    {isAddMemberDuplicateErrorAlert && (
                        <CustomAlert
                            state="error"
                            message="Ein:e Benutzer:in kann maximal zu einer Abteilung hinzugefügt werden!
                                Bitte den:die Benutzer:in zunächst von der ursprünglichen Abteilung entfernen!"
                        />
                    )}
                    <CustomButton
                        onClick={onAddMemberButtonClick}
                        label="Hinzufügen"
                        symbol={<Add />}
                    />
                    <Box my={1.5} />
                    <CustomHeading2 text="Benutzer:in von Abteilung entfernen" />
                    <Box my={1} />
                    <DepartmentUserTableForm
                        userList={userOptionsList}
                        department={form.department}
                        fetchAndMergeChosenDepartmentWithUserList={fetchAndMergeChosenDepartmentWithUserList}
                        setIsSend={setIsSend}
                        handleError={handleError}
                        isDepartmentRequiredForFetch={true}
                        getRemoveCall={(department, member) => inventoryManagementService.deleteDepartmentMember(department, member)}
                    />
                </>
            )}
        </>
    );
}
