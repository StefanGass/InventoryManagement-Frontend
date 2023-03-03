import { FC, useContext, useEffect, useState } from 'react';
import { Container, Grid, Typography, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/router';
import { IDepartment, IDetailInventoryItem, ILocation, IPicture, IPrinter, ISupplier, IType } from 'components/interfaces';
import LoadingSpinner from 'components/layout/LoadingSpinner';
import PDFDisplay from 'components/image-upload/PDFDisplay';
import InventoryForm from 'components/forms/inventory-form/InventoryForm';
import CustomButton from 'components/form-fields/CustomButton';
import { ArrowBack, Cancel, Edit, Repeat } from '@mui/icons-material';
import ImageGallery from 'components/image-upload/ImageGallery';
import ActivationForm from 'components/forms/inventory-form/ActivationForm';
import DataTableChange from 'components/tables/DataTableChange';
import { UserContext } from 'pages/_app';
import { Box } from '@mui/system';
import PrintingForm from 'components/forms/inventory-form/PrintingForm';
import CustomDivider from 'components/layout/CustomDivider';
import lightTheme, { darkGrey, darkTheme } from 'styles/theme';
import HandoverForm from 'components/forms/inventory-form/HandoverForm';
import QrCode from 'components/layout/QrCode';
import CustomAlert from 'components/form-fields/CustomAlert';

const Details: FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const matchesTablet = useMediaQuery(lightTheme.breakpoints.down('md'));
    const matchesPhone = useMediaQuery(lightTheme.breakpoints.down('sm'));

    const { userId, firstName, lastName, admin, superAdmin, departmentId, departmentName, themeMode } = useContext(UserContext);

    const [error, setError] = useState('');
    const [inventoryItem, setInventoryItem] = useState<IDetailInventoryItem | null>(null);
    const [imageList, setImageList] = useState<IPicture[] | null>(null);
    const [pdfList, setPdfList] = useState<IPicture[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState<IType[] | JSON | null>(null);
    const [location, setLocation] = useState<ILocation[] | JSON | null>(null);
    const [supplier, setSupplier] = useState<ISupplier[] | JSON | null>(null);
    const [printer, setPrinter] = useState<IPrinter[] | JSON | null>(null);
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
            // TODO Server error when trying to access id that does not exist
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
            fetchData('printer/' + userId, setPrinter).catch((e) => setError(e.message));
            if (admin || superAdmin) {
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

    // TODO the breakpoint-section needs some love :-)

    if (!id || !inventoryItem || loading) {
        return (
            <Container
                sx={{
                    mt: 12,
                    mb: 8,
                    display: 'flex',
                    flexFlow: 'column nowrap',
                    alignItems: 'center'
                }}
            >
                <LoadingSpinner />
            </Container>
        );
    } else if (error) {
        return (
            <CustomAlert
                state="warning"
                message="Serverfehler - bitte kontaktiere die IT!"
            />
        );
    } else if (formError || updated || activationMessage) {
        return (
            <Container sx={{ mt: 12, mb: 8, display: 'flex', flexFlow: 'column nowrap', alignItems: 'center' }}>
                <Box sx={{ my: 1 }} />
                <Typography
                    variant="h1"
                    sx={{ alignSelf: 'center', flexGrow: 1 }}
                >
                    {inventoryItem.itemInternalNumber}
                </Typography>
                <Box sx={{ my: 0.5 }} />
                {formError && (
                    <>
                        <CustomAlert
                            state="error"
                            message={'Es ist folgender fehler aufgetreten: ' + { formError }}
                        />
                        <CustomButton
                            label="Erneut versuchen"
                            onClick={() => setFormError('')}
                            symbol={<Repeat />}
                        />
                    </>
                )}
                {(updated || activationMessage) && (
                    <>
                        {activationMessage ? (
                            <CustomAlert
                                state="success"
                                message={activationMessage}
                            />
                        ) : (
                            <CustomAlert
                                state="success"
                                message="Der Gegenstand wurde erfolgreich bearbeitet."
                            />
                        )}
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
                    </>
                )}
            </Container>
        );
    } else if (!admin && !superAdmin && inventoryItem.department?.id !== departmentId) {
        return (
            <Container
                sx={{
                    mt: 12,
                    mb: 8,
                    display: 'flex',
                    flexFlow: 'column nowrap',
                    alignItems: 'center'
                }}
            >
                <Typography
                    variant="h1"
                    sx={{ alignSelf: 'center', flexGrow: 1 }}
                >
                    {inventoryItem.itemInternalNumber}
                </Typography>
                <CustomAlert
                    state="error"
                    message="Dieser Inventargegenstand gehört nicht zu Ihrer Abteilung und kann somit nicht bearbeitet werden."
                />
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
                    mb: 8,
                    display: 'flex',
                    flexFlow: 'column nowrap',
                    alignItems: 'center'
                }}
            >
                {!inventoryItem.active && (
                    <Typography
                        variant="h1"
                        color={themeMode === 'dark' ? darkTheme.palette.error.main : lightTheme.palette.error.main}
                    >
                        <strong>*** DEAKTIVIERT ***</strong>
                    </Typography>
                )}
                {inventoryItem.pieces === inventoryItem.piecesDropped && (
                    <Typography
                        variant="h1"
                        color={inventoryItem.active ? (themeMode === 'dark' ? darkTheme.palette.error.main : lightTheme.palette.error.main) : darkGrey}
                    >
                        <strong>*** AUSGESCHIEDEN ***</strong>
                    </Typography>
                )}
                {inventoryItem.itemInternalNumber && matchesTablet ? (
                    <Grid
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginTop: '10px'
                        }}
                    >
                        {!(imageList && imageList.length > 0) && !(pdfList && pdfList.length > 0) && (
                            <QrCode
                                value={inventoryItem.itemInternalNumber}
                                size={64}
                            />
                        )}
                        <Typography
                            variant="h1"
                            sx={{
                                alignSelf: 'center',
                                flexGrow: 1,
                                marginLeft: `${!(imageList && imageList.length > 0) && !(pdfList && pdfList.length > 0) && '20px'}`
                            }}
                        >
                            {inventoryItem.itemInternalNumber}
                        </Typography>
                    </Grid>
                ) : (
                    <Container
                        sx={{
                            display: 'flex',
                            flexFlow: 'row nowrap',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            marginLeft: '0.25em'
                        }}
                    >
                        {inventoryItem.itemInternalNumber && !(imageList && imageList.length > 0) && !(pdfList && pdfList.length > 0) ? (
                            <>
                                <QrCode
                                    value={inventoryItem.itemInternalNumber}
                                    size={64}
                                />
                                <Typography
                                    variant="h1"
                                    sx={{ alignSelf: 'center', flexGrow: 1, marginLeft: '25px' }}
                                >
                                    {inventoryItem.itemInternalNumber}
                                </Typography>
                            </>
                        ) : (
                            <Typography
                                variant="h1"
                                sx={{ alignSelf: 'center', flexGrow: 1 }}
                            >
                                {inventoryItem.itemInternalNumber}
                            </Typography>
                        )}
                        {!matchesTablet && (
                            <CustomButton
                                onClick={() => setDisabled((disable) => !disable)}
                                label={disabled ? 'Bearbeiten' : 'Abbrechen'}
                                symbol={disabled ? <Edit /> : <Cancel />}
                                disabled={!inventoryItem.active || (!admin && !superAdmin && inventoryItem.pieces === inventoryItem.piecesDropped)}
                            />
                        )}
                    </Container>
                )}
                <Container
                    sx={{
                        mb: 3,
                        display: 'flex',
                        flexFlow: 'row wrap',
                        justifyContent: 'space-around'
                    }}
                >
                    {inventoryItem.itemInternalNumber && imageList && imageList.length > 0 && !(pdfList && pdfList.length > 0) ? (
                        matchesPhone ? (
                            <Box
                                justifyContent="center"
                                sx={{ paddingTop: '1.5em' }}
                            >
                                <QrCode
                                    value={inventoryItem.itemInternalNumber}
                                    size={128}
                                />
                            </Box>
                        ) : (
                            <Box
                                marginRight="auto"
                                marginBottom="1em"
                                marginLeft={matchesPhone ? '3em' : '0.5em'}
                                sx={{ paddingTop: '1em' }}
                            >
                                <QrCode
                                    value={inventoryItem.itemInternalNumber}
                                    size={128}
                                />
                            </Box>
                        )
                    ) : (
                        inventoryItem.itemInternalNumber &&
                        ((imageList && imageList.length > 0) || (pdfList && pdfList.length > 0)) && (
                            <Box
                                marginBottom={matchesPhone ? 0 : '1em'}
                                marginRight={matchesPhone ? '3em' : 'auto'}
                                marginLeft={matchesPhone ? '3em' : '0.5em'}
                                sx={{ paddingTop: '1em' }}
                            >
                                <QrCode
                                    value={inventoryItem.itemInternalNumber}
                                    size={128}
                                />
                            </Box>
                        )
                    )}
                    {pdfList && pdfList.length > 0 && (
                        <Grid
                            marginLeft={matchesPhone ? 0 : '2em'}
                            marginRight={matchesPhone ? 0 : '2em'}
                        >
                            <PDFDisplay pdfs={pdfList} />
                        </Grid>
                    )}
                    {imageList && imageList.length > 0 && (
                        <Box sx={{ paddingTop: '1em' }}>
                            <ImageGallery images={imageList} />
                        </Box>
                    )}
                </Container>
                {matchesTablet && (
                    <Grid marginBottom="25px">
                        <CustomButton
                            onClick={() => setDisabled((disable) => !disable)}
                            label={disabled ? 'Bearbeiten' : 'Abbrechen'}
                            symbol={disabled ? <Edit /> : <Cancel />}
                            disabled={!inventoryItem.active || (!admin && !superAdmin && inventoryItem.pieces === inventoryItem.piecesDropped)}
                        />
                    </Grid>
                )}
                <InventoryForm
                    type={type as IType[]}
                    supplier={supplier as ISupplier[]}
                    location={location as ILocation[]}
                    printer={printer as IPrinter[]}
                    department={department as IDepartment[]}
                    preFilledValues={inventoryItem}
                    disabled={disabled}
                    onFormSent={onFormSent}
                />
                {inventoryItem.active && inventoryItem.pieces !== inventoryItem.piecesDropped && (
                    <>
                        <CustomDivider />
                        <HandoverForm
                            inventoryItem={inventoryItem}
                            setLoading={setLoading}
                            setUpdated={setUpdated}
                        />
                        {printer && (
                            <>
                                <CustomDivider />
                                <PrintingForm
                                    inventoryId={inventoryItem.id as number}
                                    printerList={printer as IPrinter[]}
                                    showHeadline={false}
                                />
                            </>
                        )}
                    </>
                )}
                <CustomDivider />
                <ActivationForm
                    inventoryItem={inventoryItem}
                    setFormError={setFormError}
                    setUpdated={setUpdated}
                    setActivationMessage={setActivationMessage}
                />
                <CustomDivider />
                {inventoryItem?.change && <DataTableChange changeList={inventoryItem.change} />}
                <Box sx={{ my: 3 }} />
            </Container>
        );
    }
};

export default Details;
