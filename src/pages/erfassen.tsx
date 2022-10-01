import { FC, useContext, useEffect, useState } from 'react';
import LoadingSpinner from 'components/layout/LoadingSpinner';
import ServerErrorAlert from 'components/alerts/ServerErrorAlert';
import { IDepartment, IDetailInventoryItem, ILocation, ISupplier, IType } from 'components/interfaces';
import InventoryForm from 'components/forms/InventoryForm';
import { Alert, Box, Container, Stack, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import CustomButton from 'components/form-fields/CustomButton';
import { UserContext } from 'pages/_app';

const Erfassen: FC = () => {
    const [type, setType] = useState<IType[] | JSON | null>(null);
    const [location, setLocation] = useState<ILocation[] | JSON | null>(null);
    const [supplier, setSupplier] = useState<ISupplier[] | JSON | null>(null);
    const [department, setDepartment] = useState<IDepartment[] | JSON | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [formError, setFormError] = useState('');

    const { departmentId, departmentName, superAdmin, firstName, lastName } = useContext(UserContext);

    const fetchData = async (typeToFetch: string, setMethod: (res: JSON) => void) => {
        await fetch(`${process.env.HOSTNAME}/api/inventorymanagement/${typeToFetch}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then((response) => {
            if (response.ok) {
                response.json().then((res) => setMethod(res));
            }
        });
    };

    useEffect(() => {
        fetchData('type', setType).catch(() => setError(true));
        fetchData('location', setLocation).catch(() => setError(true));
        fetchData('supplier', setSupplier).catch(() => setError(true));
        if (superAdmin) {
            fetchData('department', setDepartment).catch(() => setError(true));
        } else {
            setDepartment([{ id: departmentId, departmentName }]);
        }
        setLoading(false);
    }, []);

    const onFormSent = async (
        inventoryForm: IDetailInventoryItem,
        setAskAgain: (bool: boolean) => void,
        setInventoryForm: (form: IDetailInventoryItem) => void
    ) => {
        await fetch(`${process.env.HOSTNAME}/api/inventorymanagement/inventory`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...inventoryForm, userName: `${firstName} ${lastName}` })
        })
            .then((response) => {
                if (response.ok) {
                    setInventoryForm({ ...inventoryForm, itemInternalNumber: '' });
                    setAskAgain(true);
                } else {
                    response.json().then((res) => setFormError(res.message));
                }
            })
            .catch((error) => {
                setFormError(error);
            });
    };

    if (loading) {
        return (
            <Container
                sx={{
                    mt: 12,
                    mb: 3,
                    display: 'flex',
                    flexFlow: 'column nowrap',
                    alignItems: 'center'
                }}
            >
                <LoadingSpinner />
            </Container>
        );
    } else if (error) {
        return <ServerErrorAlert />;
    } else if (formError) {
        return (
            <Container sx={{ mt: 12, mb: 3, display: 'flex', flexFlow: 'column nowrap', alignItems: 'center' }}>
                <Stack
                    sx={{
                        width: '17em',
                        marginTop: '0.8em',
                        marginBottom: '0.5em'
                    }}
                    spacing={2}
                >
                    {formError && <Alert severity="error">Es ist folgender fehler aufgetreten: {formError}</Alert>}
                </Stack>
                <CustomButton
                    label="Neuen Gegenstand erfassen"
                    onClick={() => setFormError('')}
                    symbol={<Add />}
                />
            </Container>
        );
    } else {
        return (
            <Container sx={{ mt: 12, mb: 7 }}>
                <Typography
                    variant="h1"
                    align="center"
                    gutterBottom
                >
                    Inventargegenstand erfassen
                </Typography>
                <Box sx={{ my: 3 }} />
                <InventoryForm
                    type={type as IType[]}
                    supplier={supplier as ISupplier[]}
                    location={location as ILocation[]}
                    department={department as IDepartment[]}
                    onFormSent={onFormSent}
                />
                <Box sx={{ my: 3 }} />
            </Container>
        );
    }
};

export default Erfassen;
