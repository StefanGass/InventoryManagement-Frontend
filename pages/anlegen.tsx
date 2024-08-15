import { MouseEvent, useContext, useEffect, useState } from 'react';
import { Box, Container, Grid } from '@mui/material';
import CustomSelectParameter from 'components/form-fields/CustomSelectParameter';
import LoadingSpinner from 'components/layout/LoadingSpinner';
import { ICategory, IObjectToSend } from 'components/interfaces';
import ParameterForm from 'components/forms/ParameterForm';
import ParameterFormDepartment from 'components/forms/ParameterFormDepartment';
import { UserContext } from './_app';
import ErrorInformation from 'components/layout/ErrorInformation';
import ParameterFormDroppingReviewer from 'components/forms/ParameterFormDroppingReviewer';
import CustomHeading1 from 'components/layout/CustomHeading1';

export default function Anlegen() {
    const { userId } = useContext(UserContext);

    const [parameter, setParameter] = useState<string>('');
    const [resultList, setResultList] = useState([]);
    const [categoryOptionsList, setCategoryOptionsList] = useState<ICategory[]>([]);
    const [isAddSuccessfulAlert, setIsAddSuccessfulAlert] = useState(false);
    const [isDuplicateErrorAlert, setIsDuplicateErrorAlert] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isServerError, setIsServerError] = useState(false);

    function handleError(error: any) {
        setIsServerError(true);
        setIsLoading(false);
    }

    function getRequest(queryString: string) {
        fetch(`${process.env.HOSTNAME}/api/inventorymanagement/` + queryString, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then((response) => {
            if (response.ok) {
                response
                    .json()
                    .then((result) => {
                        setResultList(result);
                    })
                    .catch((error) => {
                        handleError(error);
                    });
                setIsLoading(false);
            } else {
                handleError(response);
            }
        });
        setIsLoading(false);
    }

    useEffect(() => {
        setIsServerError(false);
        setIsAddSuccessfulAlert(false);
        setIsDuplicateErrorAlert(false);
        if (parameter && parameter !== 'droppingReviewer') {
            setIsLoading(true);
            if (parameter === 'type') {
                fetch(`${process.env.HOSTNAME}/api/inventorymanagement/category`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                })
                    .then((response) => {
                        if (response.ok) {
                            response
                                .json()
                                .then((result: ICategory[]) => {
                                    setCategoryOptionsList(result);
                                    getRequest(parameter);
                                })
                                .catch((error) => {
                                    handleError(error);
                                });
                        } else {
                            handleError(response);
                        }
                    })
                    .catch((error) => {
                        handleError(error);
                    });
            } else if (parameter === 'departmentMember') {
                getRequest('department');
            } else {
                getRequest(parameter);
            }
        }
    }, [parameter]);

    function postRequestClick(e: MouseEvent<HTMLButtonElement>, objectToSend: IObjectToSend | null, tableToFetch: string) {
        e.preventDefault();
        setIsServerError(false);
        setIsAddSuccessfulAlert(false);
        setIsDuplicateErrorAlert(false);
        if (tableToFetch && objectToSend) {
            fetch(`${process.env.HOSTNAME}/api/inventorymanagement/` + tableToFetch, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(objectToSend)
            }).then((response) => {
                if (response.ok) {
                    setIsAddSuccessfulAlert(true);
                    getRequest(parameter);
                } else {
                    setIsDuplicateErrorAlert(true);
                }
            });
        }
    }

    return (
        <Container
            maxWidth="md"
            sx={{ my: 12 }}
        >
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
            >
                <CustomHeading1 text="Parameter anlegen" />
                <CustomSelectParameter
                    label="Parameter wählen"
                    value={parameter}
                    setValue={setParameter}
                    isError={false}
                />
                <Box my={1.5} />
                {isLoading ? (
                    <LoadingSpinner />
                ) : isServerError ? (
                    <ErrorInformation />
                ) : (
                    <>
                        {parameter !== 'departmentMember' && parameter !== 'droppingReviewer' && (
                            <ParameterForm
                                parameter={parameter}
                                tableList={resultList}
                                categoryOptions={categoryOptionsList}
                                addSuccessfulAlert={isAddSuccessfulAlert}
                                duplicateErrorAlert={isDuplicateErrorAlert}
                                onClick={postRequestClick}
                                setAddedSuccessfulAlert={setIsAddSuccessfulAlert}
                                setDuplicateErrorAlert={setIsDuplicateErrorAlert}
                            />
                        )}
                        {parameter === 'departmentMember' && (
                            <ParameterFormDepartment
                                userId={userId}
                                departmentList={resultList}
                                isAddNewDepartmentSuccessfulAlert={isAddSuccessfulAlert}
                                isAddNewDepartmentDuplicateErrorAlert={isDuplicateErrorAlert}
                                onClick={postRequestClick}
                                setIsLoading={setIsLoading}
                                setIsServerError={setIsServerError}
                                setIsAddNewDepartmentSuccessfulAlert={setIsAddSuccessfulAlert}
                                setIsAddNewDepartmentDuplicateErrorAlert={setIsDuplicateErrorAlert}
                            />
                        )}
                        {parameter === 'droppingReviewer' && <ParameterFormDroppingReviewer />}
                    </>
                )}
            </Grid>
        </Container>
    );
}
