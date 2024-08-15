import { useContext, useEffect, useState } from 'react';
import { Container, Grid, Typography, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/router';
import { ICategory, IDepartment, IDetailInventoryItem, ILocation, IPicture, IPrinter, ISupplier, IType } from 'components/interfaces';
import LoadingSpinner from 'components/layout/LoadingSpinner';
import PDFDisplay from 'components/image-upload/PDFDisplay';
import InventoryForm from 'components/forms/inventory-form/InventoryForm';
import CustomButton from 'components/form-fields/CustomButton';
import { ArrowBack, Cancel, DeleteForever, Edit, FlashOn, Lock, Repeat } from '@mui/icons-material';
import ImageGallery from 'components/image-upload/ImageGallery';
import ActivationAndDroppingQueueForm from 'components/forms/inventory-form/ActivationAndDroppingQueueForm';
import DataTableChange from 'components/tables/DataTableChange';
import { UserContext } from '../../_app';
import { Box } from '@mui/system';
import PrintingForm from 'components/forms/inventory-form/PrintingForm';
import CustomDivider from 'components/layout/CustomDivider';
import defaultTheme from 'styles/theme';
import HandoverForm from 'components/forms/inventory-form/HandoverForm';
import QrCode from 'components/layout/QrCode';
import CustomAlert from 'components/form-fields/CustomAlert';
import ErrorInformation from 'components/layout/ErrorInformation';
import inventoryManagementService from 'service/inventoryManagementService';
import ItemDisabledInformation from 'components/layout/ItemDisabledInformation';
import CustomHeading1 from 'components/layout/CustomHeading1';

export default function Details() {
    const router = useRouter();
    const { id } = router.query;
    const matchesTablet = useMediaQuery(defaultTheme.breakpoints.down('md'));
    const matchesPhone = useMediaQuery(defaultTheme.breakpoints.down('sm'));

    const { userId, firstName, lastName, isAdmin, isSuperAdmin, isAdminModeActivated, departmentId, departmentName } = useContext(UserContext);

    const [inventoryItem, setInventoryItem] = useState<IDetailInventoryItem | null>(null);
    const [imageList, setImageList] = useState<IPicture[] | null>(null);
    const [pdfList, setPdfList] = useState<IPicture[] | null>(null);
    const [category, setCategory] = useState<ICategory[] | JSON | null>(null);
    const [type, setType] = useState<IType[] | JSON | null>(null);
    const [itemName, setItemName] = useState<string[] | JSON | null>(null);
    const [location, setLocation] = useState<ILocation[] | JSON | null>(null);
    const [room, setRoom] = useState<string[] | JSON | null>(null);
    const [supplier, setSupplier] = useState<ISupplier[] | JSON | null>(null);
    const [printer, setPrinter] = useState<IPrinter[] | JSON | null>(null);
    const [department, setDepartment] = useState<IDepartment[] | JSON | null>(null);
    const [formError, setFormError] = useState('');
    const [activationMessage, setActivationMessage] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);
    const [isUpdated, setIsUpdated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isServerError, setIsServerError] = useState('');

    function handleError(msg: string) {
        setFormError(msg);
        fetchInventoryData().catch((e) => setIsServerError(e.message));
    }

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
            .catch((e) => setIsServerError(e.message));
    }

    function convertToDateString(date: string) {
        return new Date(date).toLocaleDateString('de-AT', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    async function fetchInventoryData() {
        await fetch(`${process.env.HOSTNAME}/api/inventorymanagement/inventory/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((response) => {
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
            })
            .catch((e) => setIsServerError(e.message));
    }

    useEffect(() => {
        if (id) {
            fetchInventoryData().catch((e) => setIsServerError(e.message));
            fetchData('category', setCategory).catch((e) => setIsServerError(e.message));
            fetchData('type', setType).catch((e) => setIsServerError(e.message));
            fetchData('location', setLocation).catch((e) => setIsServerError(e.message));
            fetchData('supplier', setSupplier).catch((e) => setIsServerError(e.message));
            fetchData('printer/' + userId, setPrinter).catch((e) => setIsServerError(e.message));
            if (isAdmin || isSuperAdmin) {
                fetchData('department', setDepartment).catch((e) => setIsServerError(e.message));
            } else {
                setDepartment([{ id: departmentId, departmentName }]);
            }
            fetchData(isAdminModeActivated ? 'itemname' : 'itemname/' + departmentId, setItemName).catch((e) => setIsServerError(e.message));
            fetchData(isAdminModeActivated ? 'room' : 'room/' + departmentId, setRoom).catch((e) => setIsServerError(e.message));
        }
    }, [id, isUpdated]);

    useEffect(() => {
        const image = inventoryItem?.pictures?.filter(
            (pic) => (pic.thumbnailUrl as string)?.split(',')?.[0]?.includes('image') || (pic.pictureUrl as string)?.split(',')?.[0]?.includes('image')
        );
        const pdfs = inventoryItem?.pictures?.filter((pic) => (pic.pictureUrl as string)?.split(',')?.[0]?.includes('pdf'));
        if (image && image.length !== 0) {
            setImageList(image);
        }
        if (pdfs && pdfs.length !== 0) {
            setPdfList(pdfs);
        }
        setIsLoading(false);
    }, [inventoryItem]);

    async function onFormSent(inventoryForm: IDetailInventoryItem) {
        setIsLoading(true);
        inventoryManagementService
            .updateInventoryItem({
                ...inventoryForm,
                userName: `${firstName} ${lastName}`
            })
            .then((response) => {
                if (response.ok) {
                    setIsUpdated(true);
                } else {
                    response.json().then((res) => setFormError(res.message));
                }
            })
            .catch(() => handleError('Der Gegenstand konnte nicht aktualisiert werden! Probiere es erneut oder kontaktiere die IT für Hilfe.'));
        setIsLoading(false);
    }

    // TODO the breakpoint-section needs some love :-)

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
            {!id || !inventoryItem || isLoading ? (
                <LoadingSpinner />
            ) : isServerError ? (
                <ErrorInformation />
            ) : formError || isUpdated || activationMessage ? (
                <>
                    <Box my={1} />
                    <CustomHeading1 text={inventoryItem.itemInternalNumber ? inventoryItem.itemInternalNumber : ''} />
                    <Box my={0.5} />
                    {formError && (
                        <>
                            <CustomAlert
                                state="error"
                                message="Ein Fehler ist aufgetreten! Der Vorgang konnte nicht abgeschlossen werden. Für Hilfe kontaktiere bitte die IT Abteilung!"
                            />
                            <CustomButton
                                label="Erneut versuchen"
                                onClick={() => {
                                    setIsDisabled(true);
                                    setActivationMessage('');
                                    setFormError('');
                                }}
                                symbol={<Repeat />}
                            />
                        </>
                    )}
                    {(isUpdated || activationMessage) && (
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
                                    setIsLoading(true);
                                    setIsUpdated(false);
                                    setIsDisabled(true);
                                    setActivationMessage('');
                                }}
                                symbol={<ArrowBack />}
                            />
                        </>
                    )}
                </>
            ) : !isAdmin && !isSuperAdmin && inventoryItem.department?.id !== departmentId ? (
                <>
                    <CustomHeading1 text={inventoryItem.itemInternalNumber ? inventoryItem.itemInternalNumber : ''} />
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
                </>
            ) : (
                <>
                    {!inventoryItem.active && (
                        <ItemDisabledInformation
                            headingText="DEAKTIVIERT"
                            symbol={<FlashOn fontSize="large" />}
                        />
                    )}
                    {inventoryItem.pieces === inventoryItem.piecesDropped && (
                        <ItemDisabledInformation
                            headingText="AUSGESCHIEDEN"
                            symbol={<DeleteForever fontSize="large" />}
                        />
                    )}
                    {inventoryItem.droppingQueue && (
                        <ItemDisabledInformation
                            headingText="GESPERRT"
                            infoText={inventoryItem.droppingQueue.toUpperCase() + ' ausständig'}
                            symbol={<Lock fontSize="large" />}
                        />
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
                            <Grid
                                container
                                flexDirection="column"
                                alignContent="flex-start"
                                sx={{
                                    alignSelf: 'center',
                                    flexGrow: 1,
                                    marginLeft: `${!(imageList && imageList.length > 0) && !(pdfList && pdfList.length > 0) && '20px'}`
                                }}
                            >
                                <Typography
                                    variant="h1"
                                    textAlign="center"
                                >
                                    {inventoryItem.itemInternalNumber}
                                </Typography>
                                {inventoryItem.creationDate && inventoryItem.lastChangedDate && (
                                    <Typography variant="caption">
                                        &nbsp;angelegt {convertToDateString(inventoryItem.creationDate)}, letzte Änderung{' '}
                                        {convertToDateString(inventoryItem.lastChangedDate)}
                                    </Typography>
                                )}
                            </Grid>
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
                                    <Grid
                                        container
                                        flexDirection="column"
                                        alignContent="flex-start"
                                        sx={{ alignSelf: 'center', flexGrow: 1, marginLeft: '25px' }}
                                    >
                                        <Typography variant="h1">{inventoryItem.itemInternalNumber}</Typography>
                                        {inventoryItem.creationDate && inventoryItem.lastChangedDate && (
                                            <Typography variant="caption">
                                                &nbsp;angelegt {convertToDateString(inventoryItem.creationDate)}, letzte Änderung{' '}
                                                {convertToDateString(inventoryItem.lastChangedDate)}
                                            </Typography>
                                        )}
                                    </Grid>
                                </>
                            ) : (
                                <Grid
                                    container
                                    flexDirection="column"
                                    alignContent="flex-start"
                                    sx={{ alignSelf: 'center', flexGrow: 1 }}
                                >
                                    <Typography variant="h1">{inventoryItem.itemInternalNumber}</Typography>
                                    {inventoryItem.creationDate && inventoryItem.lastChangedDate && (
                                        <Typography variant="caption">
                                            &nbsp;angelegt {convertToDateString(inventoryItem.creationDate)}, letzte Änderung{' '}
                                            {convertToDateString(inventoryItem.lastChangedDate)}
                                        </Typography>
                                    )}
                                </Grid>
                            )}
                            {!matchesTablet && (
                                <CustomButton
                                    onClick={() => setIsDisabled((disable) => !disable)}
                                    label={isDisabled ? 'Bearbeiten' : 'Abbrechen'}
                                    symbol={isDisabled ? <Edit /> : <Cancel />}
                                    isDisabled={
                                        inventoryItem.droppingQueue !== undefined ||
                                        !inventoryItem.active ||
                                        (!isAdmin && !isSuperAdmin && inventoryItem.pieces === inventoryItem.piecesDropped)
                                    }
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
                                    sx={{ paddingTop: '1.5em', marginLeft: '10px', marginRight: '10px' }}
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
                                onClick={() => setIsDisabled((disable) => !disable)}
                                label={isDisabled ? 'Bearbeiten' : 'Abbrechen'}
                                symbol={isDisabled ? <Edit /> : <Cancel />}
                                isDisabled={
                                    inventoryItem.droppingQueue !== undefined ||
                                    !inventoryItem.active ||
                                    (!isAdmin && !isSuperAdmin && inventoryItem.pieces === inventoryItem.piecesDropped)
                                }
                            />
                        </Grid>
                    )}
                    <InventoryForm
                        category={category as ICategory[]}
                        type={type as IType[]}
                        itemName={itemName as string[]}
                        setItemName={setItemName}
                        supplier={supplier as ISupplier[]}
                        location={location as ILocation[]}
                        room={room as string[]}
                        setRoom={setRoom}
                        printer={printer as IPrinter[]}
                        department={department as IDepartment[]}
                        preFilledValues={inventoryItem}
                        isDisabled={isDisabled}
                        onFormSent={onFormSent}
                        isShowIssueDropReturnForm={inventoryItem.droppingQueue === undefined}
                    />
                    {inventoryItem.droppingQueue === undefined && inventoryItem.active && inventoryItem.pieces !== inventoryItem.piecesDropped && (
                        <>
                            {inventoryItem.pieces === 1 && (
                                <>
                                    <CustomDivider />
                                    <HandoverForm
                                        inventoryItem={inventoryItem}
                                        setIsUpdated={setIsUpdated}
                                        setIsLoading={setIsLoading}
                                        setServerError={setIsServerError}
                                    />
                                </>
                            )}
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
                    <ActivationAndDroppingQueueForm
                        inventoryItem={inventoryItem}
                        setUpdated={setIsUpdated}
                        setActivationMessage={setActivationMessage}
                        onFormSent={onFormSent}
                        handleError={handleError}
                    />
                    <CustomDivider />
                    {inventoryItem?.change && <DataTableChange changeList={inventoryItem.change} />}
                    <Box sx={{ my: 3 }} />
                </>
            )}
        </Container>
    );
}
