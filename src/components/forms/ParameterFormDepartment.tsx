import { IDepartment, IDepartmentMember, IDepartmentMemberConverted, IObjectToSend, IUser } from 'components/interfaces';
import { FC, MouseEvent, useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import CustomAutocomplete from 'components/form-fields/CustomAutocomplete';
import { Add } from '@mui/icons-material';
import CustomButton from 'components/form-fields/CustomButton';
import useIsFirstRender from 'hooks/useIsFirstRender';
import useFormValidation from 'hooks/useFormValidation';
import DepartmentUserTableForm from 'components/forms/DepartmentUserTableForm';
import CustomAlert from 'components/form-fields/CustomAlert';
import userManagementService from "service/userManagementService";
import inventoryManagementService from "service/inventoryManagementService";

interface IPropertyFormDepartment {
    userId: number;
    departmentList: IDepartment[];
    addNewDepartmentSuccessfulAlert: boolean;
    addNewDepartmentDuplicateErrorAlert: boolean;
    onClick: (e: MouseEvent<HTMLButtonElement>, objectToSend: IObjectToSend | null, tableToFetch: string) => void;
    setLoading: (bool: boolean) => void;
    setServerError: (bool: boolean) => void;
    setAddNewDepartmentSuccessfulAlert: (bool: boolean) => void;
    setAddNewDepartmentDuplicateErrorAlert: (bool: boolean) => void;
}

const defaultForm: { department: IDepartment | null; user: IUser | null } = {
    department: null,
    user: null
};

const defaultValidation = [{ name: 'user', error: false }];

const ParameterFormDepartment: FC<IPropertyFormDepartment> = (props) => {
    const { userId, departmentList, setLoading, setServerError } = props;

    const [form, setForm] = useState(JSON.parse(JSON.stringify(defaultForm)));
    const [formValidation, setFormValidation] = useState(JSON.parse(JSON.stringify(defaultValidation)));
    const [isSend, setIsSend] = useState(false);
    const [addMemberSuccessfulAlert, setAddMemberSuccessfulAlert] = useState(false);
    const [addMemberDuplicateErrorAlert, setAddMemberDuplicateErrorAlert] = useState(false);

    const [allUserList, setAllUserList] = useState<IUser[]>([]);
    const [usersToChooseFrom, setUsersToChooseFrom] = useState<IDepartmentMemberConverted[]>([]);
    const [userOptionsList, setUserOptionsList] = useState<IDepartmentMemberConverted[]>([]);

    const isFirstRender = useIsFirstRender();

    const handleError = () => {
        setServerError(true);
        setLoading(false);
    };

    useEffect(() => {
        if (!isFirstRender && isSend) {
            useFormValidation(form, formValidation, setFormValidation);
            setAddMemberSuccessfulAlert(false);
            setAddMemberDuplicateErrorAlert(false);
        }
    }, [form.user]);

    useEffect(() => {
        if (!isFirstRender) {
            setLoading(true);
            fetchAndMergeChosenDepartmentWithUserList();
            setLoading(false);
            setFormValidation(JSON.parse(JSON.stringify(defaultValidation)));
        }
    }, [form.department]);

    useEffect(() => {
        userManagementService.getAllUsers(userId).then(result => {
            setAllUserList(result);
            setUsersToChooseFrom(userManagementService.convertUserToDepartmentMemberConverted(result));
            setLoading(false);
        }).catch(() => {
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

    const fetchAndMergeChosenDepartmentWithUserList = () => {
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
    };

    const onAddMemberButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        useFormValidation(form, formValidation, setFormValidation);
        setAddMemberSuccessfulAlert(false);
        setAddMemberDuplicateErrorAlert(false);
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
                        setAddMemberSuccessfulAlert(true);
                    } else {
                        setAddMemberDuplicateErrorAlert(true);
                    }
                })
                .catch(() => {
                    handleError();
                });
        }
    };

    return (
        <Grid
            container
            justifyContent="center"
        >
            <Grid>
                <Typography
                    variant="h2"
                    align="center"
                    marginTop="1.5em"
                >
                    Bestehende ändern
                </Typography>
                <Typography align="center">(User:innen hinzufügen / enfernen)</Typography>
                <Box sx={{ my: 2 }} />
                <Grid
                    container
                    justifyContent="center"
                >
                    <CustomAutocomplete
                        options={departmentList}
                        optionKey="departmentName"
                        label="Abteilung"
                        setValue={(val) => setForm((oldForm) => ({ ...oldForm, department: val as IDepartment }))}
                        value={form.department?.departmentName ?? ''}
                        error={false}
                    />
                </Grid>
                {form.department && (
                    <Grid
                        container
                        justifyContent="center"
                    >
                        <CustomAlert
                            state="warning"
                            message="ACHTUNG: Nach dem Hinzufügen oder Entfernen muss der:die betroffene User:in die Seite neu laden!"
                        />
                        <Box sx={{ my: 3 }} />
                        <Typography
                            variant="h2"
                            align="center"
                            marginTop="1.5em"
                        >
                            Hinzufügen / entfernen
                        </Typography>
                        <Box sx={{ my: 5 }} />
                        <Grid
                            container
                            justifyContent="center"
                        >
                            <CustomAutocomplete
                                options={usersToChooseFrom}
                                optionKey="name"
                                label="User"
                                setValue={(val) => setForm((oldForm) => ({ ...oldForm, user: val as IUser }))}
                                error={formValidation.some((field) => field.error) ?? false}
                            />
                        </Grid>
                        {addMemberSuccessfulAlert && (
                            <CustomAlert
                                state="success"
                                message="User:in erfolgreich hinzugefügt!"
                            />
                        )}
                        {formValidation.some((field) => field.error) && (
                            <CustomAlert
                                state="error"
                                message="Mindestens ein:e User:in auswählen!"
                            />
                        )}
                        {addMemberDuplicateErrorAlert && (
                            <CustomAlert
                                state="error"
                                message="Ein:e User:in kann maximal zu einer Abteilung hinzugefügt werden!
                                Bitte den/die User:in zunächst von der ursprünglichen Abteilung entfernen!"
                            />
                        )}
                        <Grid>
                            <CustomButton
                                onClick={onAddMemberButtonClick}
                                label="Hinzufügen"
                                symbol={<Add />}
                            />
                        </Grid>
                        <Box sx={{ my: 7 }} />
                        <DepartmentUserTableForm
                            userList={userOptionsList}
                            department={form.department}
                            fetchAndMergeChosenDepartmentWithUserList={fetchAndMergeChosenDepartmentWithUserList}
                            setIsSend={setIsSend}
                            handleError={handleError}
                            getRemoveCall={(department, member) =>
                                inventoryManagementService.deleteDepartmentMember(department,member)}
                        />
                    </Grid>
                )}
            </Grid>
        </Grid>
    );
};

export default ParameterFormDepartment;
