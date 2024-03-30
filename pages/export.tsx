import { useEffect, useState } from 'react';
import LoadingSpinner from 'components/layout/LoadingSpinner';
import ExportForm from 'components/forms/ExportForm';
import { Container, Grid } from '@mui/material';
import ErrorInformation from 'components/layout/ErrorInformation';
import { ICategory, IDepartment, ILocation, ISupplier, IType } from 'components/interfaces';
import CustomHeading1 from 'components/layout/CustomHeading1';

export default function Export() {
    const [type, setType] = useState<IType[] | JSON | null>([]);
    const [department, setDepartment] = useState<IDepartment[] | JSON | null>([]);
    const [location, setLocation] = useState<ILocation[] | JSON | null>([]);
    const [supplier, setSupplier] = useState<ISupplier[] | JSON | null>([]);
    const [category, setCategory] = useState<ICategory[] | JSON | null>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isServerError, setIsServerError] = useState(false);

    async function fetchData(typeToFetch: string, setMethod: (res: JSON) => void) {
        await fetch(`${process.env.HOSTNAME}/api/inventorymanagement/${typeToFetch}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then((response) => {
            if (response.ok) {
                response.json().then((res) => setMethod(res));
            }
        });
    }

    useEffect(() => {
        fetchData('type', setType).catch(() => setIsServerError(true));
        fetchData('department', setDepartment).catch(() => setIsServerError(true));
        fetchData('location', setLocation).catch(() => setIsServerError(true));
        fetchData('supplier', setSupplier).catch(() => setIsServerError(true));
        fetchData('category', setCategory).catch(() => setIsServerError(true));
        setIsLoading(false);
    }, []);

    return (
        <Container
            maxWidth={false}
            sx={{ my: 12 }}
        >
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
            >
                <CustomHeading1 text="Inventargegenstände exportieren" />
                {isLoading ? (
                    <LoadingSpinner />
                ) : isServerError ? (
                    <ErrorInformation />
                ) : (
                    <ExportForm
                        department={department as IDepartment[]}
                        category={category as ICategory[]}
                        type={type as IType[]}
                        location={location as ILocation[]}
                        supplier={supplier as ISupplier[]}
                        setIsLoading={setIsLoading}
                        setIsServerError={setIsServerError}
                    />
                )}
            </Grid>
        </Container>
    );
}
