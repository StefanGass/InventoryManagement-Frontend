import { useContext, useEffect, useState } from 'react';
import LoadingSpinner from 'components/layout/LoadingSpinner';
import { IDepartment, IDetailInventoryItem, ILocation, IPrinter, ISupplier, IType } from 'components/interfaces';
import InventoryForm from 'components/forms/inventory-form/InventoryForm';
import { Alert, Container } from '@mui/material';
import { UserContext } from './_app';
import ErrorInformation from 'components/layout/ErrorInformation';

export default function Erfassen() {
    const { userId, firstName, lastName, isAdmin, isSuperAdmin, departmentId, departmentName } = useContext(UserContext);

    const [type, setType] = useState<IType[] | JSON | null>(null);
    const [location, setLocation] = useState<ILocation[] | JSON | null>(null);
    const [supplier, setSupplier] = useState<ISupplier[] | JSON | null>(null);
    const [printer, setPrinter] = useState<IPrinter[] | JSON | null>(null);
    const [department, setDepartment] = useState<IDepartment[] | JSON | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isServerError, setIsServerError] = useState(false);
    const [formError, setFormError] = useState('');

    async function fetchData(typeToFetch: string, setMethod: (res: JSON) => void) {
        await fetch(`${process.env.HOSTNAME}/api/inventorymanagement/${typeToFetch}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((response) => {
                if (response.ok) {
                    response.json().then((res) => setMethod(res));
                }
            })
            .catch(() => setIsServerError(true));
    }

    useEffect(() => {
        fetchData('type', setType).catch(() => setIsServerError(true));
        fetchData('location', setLocation).catch(() => setIsServerError(true));
        fetchData('supplier', setSupplier).catch(() => setIsServerError(true));
        fetchData('printer/' + userId, setPrinter).catch((e) => setIsServerError(e.message));
        if (isAdmin || isSuperAdmin) {
            fetchData('department', setDepartment).catch(() => setIsServerError(true));
        } else {
            setDepartment([{ id: departmentId, departmentName }]);
        }
        setIsLoading(false);
    }, []);

    async function onFormSent(
        inventoryForm: IDetailInventoryItem,
        setAskAgain: (bool: boolean) => void,
        setInventoryForm: (form: IDetailInventoryItem) => void
    ) {
        await fetch(`${process.env.HOSTNAME}/api/inventorymanagement/inventory`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...inventoryForm, userName: `${firstName} ${lastName}` })
        })
            .then((response) => {
                if (response.ok) {
                    response.json().then((result: IDetailInventoryItem) => {
                        setInventoryForm({
                            ...inventoryForm,
                            id: result.id,
                            itemInternalNumber: result.itemInternalNumber
                        });
                        setAskAgain(true);
                    });
                } else {
                    response.json().then((res) => setFormError(res.message));
                }
            })
            .catch((error) => {
                setFormError(error);
            });
    }

    return (
        <Container sx={{ mt: 12, mb: 8 }}>
            {isLoading ? (
                <LoadingSpinner />
            ) : isServerError ? (
                <ErrorInformation />
            ) : formError ? (
                <Alert severity="error">Es ist folgender fehler aufgetreten: {formError}</Alert>
            ) : (
                <InventoryForm
                    type={type as IType[]}
                    supplier={supplier as ISupplier[]}
                    location={location as ILocation[]}
                    printer={printer as IPrinter[]}
                    department={department as IDepartment[]}
                    onFormSent={onFormSent}
                    isInitialCreation={true}
                />
            )}
        </Container>
    );
}
