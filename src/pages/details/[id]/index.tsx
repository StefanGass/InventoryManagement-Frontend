import { FC, useContext, useEffect, useState } from 'react';
import { Alert, Container, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { IDepartment, IDetailInventoryItem, ILocation, IPicture, ISupplier, IType } from 'components/interfaces';
import LoadingSpinner from 'components/layout/LoadingSpinner';
import ServerErrorAlert from 'components/alerts/ServerErrorAlert';
import PDFDisplay from 'components/image-upload/PDFDisplay';
import InventoryForm from 'components/forms/InventoryForm';
import CustomButton from 'components/form-fields/CustomButton';
import { ArrowBack, Cancel, Edit, Repeat } from '@mui/icons-material';
import ImageGallery from 'components/image-upload/ImageGallery';
import ActivationForm from 'components/forms/ActivationForm';
import DataTableChanges from 'components/tables/DataTableChanges';
import { UserContext } from 'pages/_app';
import { Box } from '@mui/system';

const Details: FC = () => {
    const router = useRouter();
    const { id } = router.query;

    const { departmentId, departmentName, superAdmin, firstName, lastName } = useContext(UserContext);

    const [error, setError] = useState('');
    const [inventoryItem, setInventoryItem] = useState<IDetailInventoryItem | null>(null);
    const [imageList, setImageList] = useState<IPicture[] | null>(null);
    const [pdfList, setPdfList] = useState<IPicture[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState<IType[] | JSON | null>(null);
    const [location, setLocation] = useState<ILocation[] | JSON | null>(null);
    const [supplier, setSupplier] = useState<ISupplier[] | JSON | null>(null);
    const [department, setDepartment] = useState<IDepartment[] | JSON | null>(null);
    const [formError, setFormError] = useState('');
    const [activationMessage, setActivationMessage] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [updated, setUpdated] = useState(false);

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
        if (id) {
            const fetchInventoryData = async () => {
                await fetch(`${process.env.HOSTNAME}/api/inventorymanagement/inventory/${id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }).then((response) => {
                    if (response.ok) {
                        response.json().then((res) => {
                            Object.keys(res).forEach((key) => {
                                if (res[key] === null) {
                                    res[key] = undefined;
                                }
                            });
                            setInventoryItem(res);
                        });
                    }
                });
            };
            fetchInventoryData().catch((error) => setError(error.message));
            fetchData('type', setType).catch((e) => setError(e.message));
            fetchData('location', setLocation).catch((e) => setError(e.message));
            fetchData('supplier', setSupplier).catch((e) => setError(e.message));
            if (superAdmin) {
                fetchData('department', setDepartment).catch((e) => setError(e.message));
            } else {
                setDepartment([{ id: departmentId, departmentName }]);
            }
        }
    }, [id, updated]);

    useEffect(() => {
        const image = inventoryItem?.pictures?.filter((pic) => (pic.pictureUrl as string)?.split(',')?.[0]?.includes('image'));
        const pdfs = inventoryItem?.pictures?.filter((pic) => (pic.pictureUrl as string)?.split(',')?.[0]?.includes('pdf'));
        if (image && image.length !== 0) {
            setImageList(image);
        }
        if (pdfs && pdfs.length !== 0) {
            setPdfList(pdfs);
        }
        setLoading(false);
    }, [inventoryItem]);

    const onFormSent = async (inventoryForm: IDetailInventoryItem) => {
        setLoading(true);
        await fetch(`${process.env.HOSTNAME}/api/inventorymanagement/inventory/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...inventoryForm, userName: `${firstName} ${lastName}` })
        }).then((response) => {
            if (response.ok) {
                setUpdated(true);
            } else {
                response.json().then((res) => setFormError(res.message));
            }
        });
        setLoading(false);
    };

    if (!id || !inventoryItem || loading) {
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
    } else if (formError || updated || activationMessage) {
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
                    {updated && !activationMessage && <Alert severity="success">Der Gegenstand wurde erfolgreich bearbeitet.</Alert>}
                    {activationMessage && <Alert severity="success">{activationMessage}</Alert>}
                </Stack>
                {formError && (
                    <CustomButton
                        label="Erneut versuchen"
                        onClick={() => setFormError('')}
                        symbol={<Repeat />}
                    />
                )}
                {(updated || activationMessage) && (
                    <CustomButton
                        label="Zurück zur Detailseite"
                        onClick={() => {
                            setLoading(true);
                            setUpdated(false);
                            setDisabled(true);
                            setActivationMessage('');
                        }}
                        symbol={<ArrowBack />}
                    />
                )}
            </Container>
        );
    } else if (!superAdmin && inventoryItem.department?.id !== departmentId) {
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
                    <Alert severity="error">Dieser Inventargegenstand gehört nicht zu Ihrer Abteilung und kann somit nicht bearbeitet werden.</Alert>
                </Stack>
                <CustomButton
                    label="Zurück zur Hauptseite"
                    onClick={() => {
                        router.push('/');
                    }}
                    symbol={<ArrowBack />}
                />
            </Container>
        );
    } else {
        return (
            <Container
                sx={{
                    mt: 12,
                    mb: 6,
                    display: 'flex',
                    flexFlow: 'column nowrap',
                    alignItems: 'center'
                }}
            >
                <Container sx={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'flex-start' }}>
                    <Typography
                        variant="h1"
                        sx={{ alignSelf: 'center', flexGrow: 1 }}
                    >
                        {inventoryItem.itemInternalNumber}
                    </Typography>
                    <CustomButton
                        onClick={() => setDisabled((disable) => !disable)}
                        label={disabled ? 'Bearbeiten' : 'Abbrechen'}
                        symbol={disabled ? <Edit /> : <Cancel />}
                        disabled={(!inventoryItem.active && !superAdmin) || (!superAdmin && inventoryItem.pieces === inventoryItem.piecesDropped)}
                    />
                </Container>
                <Container
                    sx={{
                        mb: 3,
                        display: 'flex',
                        flexFlow: 'row wrap',
                        alignItems: 'center',
                        justifyContent: 'space-around'
                    }}
                >
                    {imageList && imageList.length > 0 && <ImageGallery images={imageList} />}
                    {pdfList && pdfList.length > 0 && <PDFDisplay pdfs={pdfList} />}
                </Container>
                <InventoryForm
                    type={type as IType[]}
                    supplier={supplier as ISupplier[]}
                    location={location as ILocation[]}
                    department={department as IDepartment[]}
                    preFilledValues={inventoryItem}
                    disabled={disabled}
                    onFormSent={onFormSent}
                />
                <Box sx={{ my: 2 }} />
                <ActivationForm
                    disabled={disabled}
                    inventoryItem={inventoryItem}
                    setFormError={setFormError}
                    setUpdated={setUpdated}
                    setActivationMessage={setActivationMessage}
                />
                <Box sx={{ my: 2 }} />
                {inventoryItem?.change && <DataTableChanges changeList={inventoryItem.change} />}
                <Box sx={{ my: 3 }} />
            </Container>
        );
    }
};

export default Details;
