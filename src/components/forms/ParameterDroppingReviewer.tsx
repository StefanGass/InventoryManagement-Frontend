import { useContext, useEffect, useState } from "react";
import { IDepartment, IDepartmentMember, IDepartmentMemberConverted } from "components/interfaces";
import userManagementService from "service/userManagementService";
import { UserContext } from "pages/_app";
import DepartmentUserTableForm from "components/forms/DepartmentUserTableForm";
import LoadingSpinner from "components/layout/LoadingSpinner";
import ErrorInformation from "components/layout/ErrorInformation";
import inventoryManagementService from "service/inventoryManagementService";
import CustomAutocomplete from "components/form-fields/CustomAutocomplete";
import { Box, Grid, Typography } from "@mui/material";
import CustomAlert from "components/form-fields/CustomAlert";
import CustomButton from "components/form-fields/CustomButton";
import { Add } from "@mui/icons-material";

const ParameterDroppingReviewer = () => {
    const { userId } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [users, setUsers] = useState<IDepartmentMemberConverted[]>([]);
    const [departmentMember, setDepartmentMember] = useState<IDepartmentMember[]>([]);

    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [addMessage, setAddMessage] = useState<"DUPLICATE" | "SUCCESS" | "ERROR" | null>(null);
    const [dummyDepartment] = useState<IDepartment>({ id: -1, departmentName: "test" });
    const handleError = () => {
        setLoading(false);
        setError(true);
    };
    const addUser = () => {
        if (!selectedUser) {
            setAddMessage("ERROR");
            return;
        }
        const member = departmentMember.find(x => x.userId == selectedUser.id);
        if (member?.droppingReviewer) {
            setAddMessage("DUPLICATE");
            return;
        }
        updateReviewer(member, true);
    };
    const updateReviewer = (member: IDepartmentMember | undefined, isReviewer: boolean) => {
        if (member) {
            return inventoryManagementService.updateReviewer(member.userId, isReviewer).then(() => {
                member.droppingReviewer = isReviewer;
                setDepartmentMember([...departmentMember]);
                setAddMessage("SUCCESS");
            }).catch(() => handleError());
        }
        return new Promise<void>(() => Promise.resolve());
    };

    useEffect(() => {
        setLoading(true);
        userManagementService.getAllUsers(userId).then(result => {
            const users = userManagementService.convertUserToDepartmentMemberConverted(result);

            inventoryManagementService.getAllDepartments().then(departments => {
                const mem: IDepartmentMember[] = [];
                departments.forEach(d => {
                    if (d.departmentMembers) {
                        d.departmentMembers.forEach(m => {
                            const u = users.find(u => u.id === m.userId);
                            if (u) {
                                u.name += ` (${d.departmentName})`;
                            }
                        });
                        mem.push(...d.departmentMembers);
                    }
                });
                setDepartmentMember(mem);
                setUsers(users);
                setLoading(false);
            }).catch(() => handleError());
        }).catch(() => handleError());

    }, []);
    return (
        <>
            <LoadingSpinner hidden={!loading}></LoadingSpinner>
            <ErrorInformation hidden={!error}></ErrorInformation>
            {!error && !loading &&
                <>
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
                            options={users.filter(x => departmentMember.some(m => !m.droppingReviewer && x.id === m.userId))}
                            optionKey="name"
                            label="User"
                            testId="addUserAutoComplete"
                            setValue={(val) => {
                                setSelectedUser(val);
                                setAddMessage(null);
                            }}
                            error={false}
                        />
                        <CustomButton
                            onClick={() => addUser()}
                            id="hinzufuegenButton"
                            label="Hinzufügen"
                            symbol={<Add />}
                        />
                        {addMessage === "SUCCESS" && (
                            <CustomAlert
                                state="success"
                                message="User:in erfolgreich hinzugefügt!"
                            />
                        )}
                        {addMessage === "ERROR" && (
                            <CustomAlert
                                state="error"
                                message="Mindestens ein:e User:in auswählen!"
                            />
                        )}
                        {addMessage === "DUPLICATE" && (
                            <CustomAlert
                                state="error"
                                message="User:in wurde bereits hinzugefügt!"
                            />
                        )}
                    </Grid>
                    <Grid>

                    </Grid>
                    <Box sx={{ my: 7 }} />
                    <DepartmentUserTableForm
                        department={dummyDepartment}
                        userList={users
                        .filter(x =>
                            departmentMember.some(m => x.id == m.userId && m.droppingReviewer))}
                                             fetchAndMergeChosenDepartmentWithUserList={() => {
                                             }}
                                             setIsSend={() => {
                                             }}
                                             handleError={() => handleError()}
                                             getRemoveCall={(department, row) => {
                                                 const member = departmentMember.find(x => x.userId == row);
                                                 return updateReviewer(member, false);
                                             }}


                    />
                </>}
        </>
    );
};

export default ParameterDroppingReviewer;
