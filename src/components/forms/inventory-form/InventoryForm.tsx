import { useContext, useEffect, useState } from 'react';
import { IDepartment, IDetailInventoryItem, ILocation, IPictureUpload, IPrinter, ISupplier, IType } from 'components/interfaces';
import { Box, Grid, Tooltip } from '@mui/material';
import CustomAutocomplete from 'components/form-fields/CustomAutocomplete';
import { Add, CheckCircle } from '@mui/icons-material';
import CustomTextField from 'components/form-fields/CustomTextField';
import ImageUpload from 'components/image-upload/ImageUpload';
import CustomDatePicker from 'components/form-fields/CustomDatePicker';
import useFormValidation from 'hooks/useFormValidation';
import useIsFirstRender from 'hooks/useIsFirstRender';
import CustomButton from 'components/form-fields/CustomButton';
import { defaultInventory, droppedSchema, inventoryFormRequiredSchema, issuedSchema } from 'components/forms/inventory-form/inventoryFormDefaultValues';
import AskAgainFormGroup from 'components/forms/inventory-form/AskAgainFormGroup';
import { UserContext } from '../../../../pages/_app';
import LoadingSpinner from 'components/layout/LoadingSpinner';
import CustomDivider from 'components/layout/CustomDivider';
import IssueReturnDropForm from 'components/forms/inventory-form/IssueReturnDropForm';
import CustomAlert from 'components/form-fields/CustomAlert';
import ErrorInformation from 'components/layout/ErrorInformation';
import CustomHeading1 from 'components/layout/CustomHeading1';

interface IInventoryFormProps {
    type: IType[];
    supplier: ISupplier[];
    location: ILocation[];
    printer: IPrinter[];
    department?: IDepartment[];
    preFilledValues?: IDetailInventoryItem;
    isDisabled?: boolean;
    onFormSent: (...params) => void;
    isInitialCreation?: boolean;
    isShowIssueDropReturnForm?: boolean;
}

// TODO include suggestions at "Beschreibung" (auto complete?)

export default function InventoryForm(props: IInventoryFormProps) {
    const {
        type,
        location,
        supplier,
        printer,
        department,
        preFilledValues,
        isDisabled,
        onFormSent,
        isInitialCreation, // probably replace initial creation by preFilledValues (if that's possible)
        isShowIssueDropReturnForm = true
    } = props;
    const { userId, isAdmin, isSuperAdmin } = useContext(UserContext);
    const isFirstRender = useIsFirstRender();

    const [inventoryForm, setInventoryForm] = useState<IDetailInventoryItem>(
        preFilledValues
            ? {
                  ...preFilledValues,
                  pictures: undefined
              }
            : JSON.parse(JSON.stringify(defaultInventory))
    );
    const [pictureList, setPictureList] = useState<IPictureUpload[]>([]);
    const [isSinglePieceItem, setIsSinglePieceItem] = useState(false);
    const [formValidation, setFormValidation] = useState(JSON.parse(JSON.stringify(inventoryFormRequiredSchema)));
    const [isPiecesCorrect, setIsPiecesCorrect] = useState(true);
    const [issuedFormValidation, setIssuedFormValidation] = useState(JSON.parse(JSON.stringify(issuedSchema)));
    const [isIssuedError, setIsIssuedError] = useState(false);
    const [droppedFormValidation, setDroppedFormValidation] = useState(JSON.parse(JSON.stringify(droppedSchema)));
    const [isDroppedError, setIsDroppedError] = useState(false);
    const [isSend, setIsSend] = useState(false);
    const [isAskAgain, setIsAskAgain] = useState(false);
    const [reloadDepartmentAfterAddingInventoryItem, setReloadDepartmentAfterAddingInventoryItem] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isServerError, setIsServerError] = useState(false);

    useEffect(() => {
        if (!isFirstRender && isSend) {
            useFormValidation(inventoryForm, formValidation, setFormValidation);
            useFormValidation(inventoryForm, droppedFormValidation, setDroppedFormValidation);
            useFormValidation(inventoryForm, issuedFormValidation, setIssuedFormValidation);
        }
        if (isFirstRender) {
            if (inventoryForm && inventoryForm.pieces && inventoryForm.pieces === 1 && !isInitialCreation) {
                setIsSinglePieceItem(true);
            }
        }
    }, [inventoryForm]);

    useEffect(() => {
        if (isInitialCreation) {
            fetch(`${process.env.HOSTNAME}/api/inventorymanagement/department/user/${userId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
                .then((response) => {
                    if (response.ok) {
                        response
                            .json()
                            .then((result) => {
                                setInventoryForm({ ...inventoryForm, department: result } as IDetailInventoryItem);
                            })
                            .catch(() => {
                                setIsServerError(true);
                            });
                    }
                })
                .catch(() => {
                    setIsServerError(true);
                });
            setReloadDepartmentAfterAddingInventoryItem(false);
        }
    }, [reloadDepartmentAfterAddingInventoryItem]);

    useEffect(() => {
        if (!isFirstRender && preFilledValues) {
            setInventoryForm({
                ...preFilledValues,
                pictures: undefined
            });
            setIsPiecesCorrect(true);
            setIsIssuedError(false);
            setIsDroppedError(false);
        }
    }, [isDisabled]);

    function refreshInternalNumber() {
        fetch(`${process.env.HOSTNAME}/api/inventorymanagement/inventory/internal_number/${inventoryForm.type?.typeName}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((response) => {
                if (response.ok) {
                    response
                        .text()
                        .then((result) => {
                            setInventoryForm({
                                ...inventoryForm,
                                itemInternalNumber: result
                            } as IDetailInventoryItem);
                        })
                        .catch((error) => {
                            console.log(error);
                            setInventoryForm({
                                ...inventoryForm,
                                itemInternalNumber: 'ERROR'
                            } as IDetailInventoryItem);
                        });
                } else {
                    setInventoryForm({ ...inventoryForm, itemInternalNumber: 'ERROR' } as IDetailInventoryItem);
                }
            })
            .catch(() => {
                setInventoryForm({ ...inventoryForm, itemInternalNumber: 'ERROR' } as IDetailInventoryItem);
            });
    }

    useEffect(() => {
        if (isInitialCreation) {
            if (inventoryForm.type?.typeName === undefined) {
                setInventoryForm({
                    ...inventoryForm,
                    itemInternalNumber: ''
                } as IDetailInventoryItem);
            } else {
                refreshInternalNumber();
            }
        }
    }, [inventoryForm.type]);

    async function onSend() {
        setIsLoading(true);
        setIsSend(true);
        const error = useFormValidation(inventoryForm, formValidation, setFormValidation);
        const correctPieces =
            inventoryForm.pieces === inventoryForm?.piecesStored + inventoryForm?.piecesDropped + inventoryForm?.piecesIssued &&
            inventoryForm.pieces >= 0 &&
            inventoryForm.piecesStored >= 0 &&
            inventoryForm.piecesDropped >= 0 &&
            inventoryForm.piecesIssued >= 0;
        setIsPiecesCorrect(correctPieces);
        const dropError = useFormValidation(inventoryForm, droppedFormValidation, setDroppedFormValidation, true);
        setIsDroppedError(dropError);
        const issueError = useFormValidation(inventoryForm, issuedFormValidation, setIssuedFormValidation, true);
        setIsIssuedError(issueError);
        if (!error && correctPieces && !dropError && !issueError) {
            await onFormSent(inventoryForm, setIsAskAgain, setInventoryForm); // the await MUST not be removed
            if (isInitialCreation) {
                setIsSend(false);
            }
        }
        if (isInitialCreation || error || !correctPieces || dropError || issueError) {
            setIsLoading(false);
        }
    }

    if (!type || !location || !supplier || ((isAdmin || isSuperAdmin) && !department)) {
        return null;
    }

    return (
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="top"
        >
            {!isAskAgain && isInitialCreation && (
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                >
                    <CustomHeading1 text="Inventargegenstand erfassen" />
                    <Box my={0.5} />
                </Grid>
            )}
            {isLoading ? (
                <LoadingSpinner />
            ) : isServerError ? (
                <ErrorInformation />
            ) : isAskAgain ? (
                <AskAgainFormGroup
                    inventoryItem={inventoryForm}
                    setPictureList={setPictureList}
                    refreshInternalNumber={refreshInternalNumber}
                    setAskAgain={setIsAskAgain}
                    setReloadDepartment={setReloadDepartmentAfterAddingInventoryItem}
                    setDefaultForm={() => setInventoryForm(JSON.parse(JSON.stringify(defaultInventory)))}
                    printer={printer}
                />
            ) : (
                <>
                    <Tooltip
                        title={!isDisabled && !isInitialCreation ? 'Der Typ kann nachträglich nicht geändert werden.' : undefined}
                        followCursor={true}
                        enterDelay={500}
                    >
                        <Box /* necessary for showing tooltip */>
                            <CustomAutocomplete
                                options={type}
                                optionKey="typeName"
                                label="Typ"
                                value={inventoryForm.type?.typeName ?? ''}
                                setValue={(val) => {
                                    setInventoryForm({ ...inventoryForm, type: val } as IDetailInventoryItem);
                                }}
                                isError={formValidation.find((field) => field.name === 'type')?.error ?? false}
                                isRequired={true}
                                isDisabled={!!preFilledValues}
                            />
                        </Box>
                    </Tooltip>
                    <Tooltip
                        title={!isDisabled ? 'Die Inventarnummer wird automatisch erzeugt und kann daher nicht geändert werden.' : undefined}
                        followCursor={true}
                        enterDelay={500}
                    >
                        <Box /* necessary for showing tooltip */>
                            <CustomTextField
                                label={isInitialCreation ? 'Voraussichtliche Inventarnummer' : 'Inventarnummer'}
                                value={inventoryForm.itemInternalNumber}
                                setValue={(val) => {
                                    setInventoryForm({
                                        ...inventoryForm,
                                        itemInternalNumber: val
                                    } as IDetailInventoryItem);
                                }}
                                isError={false}
                                isRequired={true}
                                isDisabled={true}
                            />
                        </Box>
                    </Tooltip>
                    <CustomTextField
                        label="Beschreibung"
                        value={inventoryForm.itemName}
                        setValue={(val) => {
                            setInventoryForm({ ...inventoryForm, itemName: val } as IDetailInventoryItem);
                        }}
                        isDisabled={isDisabled}
                    />
                    <CustomTextField
                        label="Alte Inventarnummer"
                        value={inventoryForm.oldItemNumber}
                        setValue={(val) => {
                            setInventoryForm({ ...inventoryForm, oldItemNumber: val } as IDetailInventoryItem);
                        }}
                        isError={false}
                        isDisabled={isDisabled}
                    />
                    <CustomTextField
                        label="Seriennummer"
                        value={inventoryForm.serialNumber}
                        setValue={(val) => {
                            setInventoryForm({ ...inventoryForm, serialNumber: val } as IDetailInventoryItem);
                        }}
                        isDisabled={isDisabled}
                    />
                    <CustomAutocomplete
                        options={location}
                        optionKey="locationName"
                        label="Standort"
                        value={inventoryForm.location?.locationName ?? ''}
                        setValue={(val) => {
                            setInventoryForm({ ...inventoryForm, location: val } as IDetailInventoryItem);
                        }}
                        isError={formValidation.find((field) => field.name === 'location')?.error ?? false}
                        isRequired={true}
                        isDisabled={isDisabled}
                    />
                    <CustomAutocomplete
                        options={supplier}
                        optionKey="supplierName"
                        label="Lieferant"
                        value={inventoryForm.supplier?.supplierName ?? ''}
                        setValue={(val) => {
                            setInventoryForm({ ...inventoryForm, supplier: val } as IDetailInventoryItem);
                        }}
                        isError={formValidation.find((field) => field.name === 'supplier')?.error ?? false}
                        isRequired={true}
                        isDisabled={isDisabled}
                    />
                    <CustomDatePicker
                        label="Lieferdatum"
                        value={inventoryForm.deliveryDate}
                        setValue={(val) =>
                            setInventoryForm({
                                ...inventoryForm,
                                deliveryDate: val?.toString()
                            } as IDetailInventoryItem)
                        }
                        isDisabled={isDisabled}
                    />
                    <Tooltip
                        title={!isDisabled && isSinglePieceItem ? 'Die Stückzahl kann nachträglich nicht geändert werden.' : undefined}
                        followCursor={true}
                        enterDelay={500}
                    >
                        <Box /* necessary for showing tooltip */>
                            <CustomTextField
                                label="Stückzahl gesamt"
                                value={inventoryForm.pieces}
                                setValue={(val) => {
                                    if (Number(val) <= 0) {
                                        setInventoryForm({
                                            ...inventoryForm,
                                            pieces: 0
                                        } as IDetailInventoryItem);
                                    } else {
                                        if (isInitialCreation) {
                                            setInventoryForm({
                                                ...inventoryForm,
                                                pieces: Number(val),
                                                piecesStored: Number(val)
                                            } as IDetailInventoryItem);
                                        } else {
                                            setInventoryForm({
                                                ...inventoryForm,
                                                pieces: Number(val),
                                                piecesStored: Number(val) - (inventoryForm.piecesIssued + inventoryForm.piecesDropped)
                                            } as IDetailInventoryItem);
                                        }
                                    }
                                    setIsPiecesCorrect(true);
                                }}
                                isError={(formValidation.find((field) => field.name === 'pieces')?.error ?? false) || !isPiecesCorrect}
                                isRequired={true}
                                isDisabled={isDisabled || isSinglePieceItem}
                                type="number"
                            />
                        </Box>
                    </Tooltip>
                    {!isInitialCreation && (
                        <>
                            <Tooltip
                                title={!isDisabled ? "Zum Ändern die Funktionen 'Ausgabe starten' oder 'Ausscheiden starten' verwenden." : undefined}
                                followCursor={true}
                                enterDelay={500}
                            >
                                <Box /* necessary for showing tooltip */>
                                    <CustomTextField
                                        label="Stückzahl lagernd"
                                        value={inventoryForm.piecesStored}
                                        setValue={(val) => {
                                            if (Number(val) <= 0) {
                                                setInventoryForm({
                                                    ...inventoryForm,
                                                    piecesStored: 0
                                                } as IDetailInventoryItem);
                                            } else {
                                                if (isSinglePieceItem) {
                                                    setInventoryForm({
                                                        ...inventoryForm,
                                                        piecesStored: 1,
                                                        piecesIssued: 0,
                                                        piecesDropped: 0
                                                    } as IDetailInventoryItem);
                                                } else {
                                                    setInventoryForm({
                                                        ...inventoryForm,
                                                        piecesStored: Number(val)
                                                    } as IDetailInventoryItem);
                                                }
                                            }
                                            setIsPiecesCorrect(true);
                                        }}
                                        isError={!isPiecesCorrect}
                                        isDisabled={true}
                                        type="number"
                                    />
                                </Box>
                            </Tooltip>
                            <Tooltip
                                title={!isDisabled ? "Zum Ändern die Funktionen 'Ausgabe starten' oder 'Rücknahme starten' verwenden." : undefined}
                                followCursor={true}
                                enterDelay={500}
                            >
                                <Box /* necessary for showing tooltip */>
                                    <CustomTextField
                                        label="Stückzahl ausgegeben"
                                        value={inventoryForm.piecesIssued}
                                        setValue={(val) => {
                                            if (Number(val) <= 0) {
                                                setInventoryForm({
                                                    ...inventoryForm,
                                                    piecesIssued: 0
                                                } as IDetailInventoryItem);
                                            } else {
                                                if (isSinglePieceItem) {
                                                    setInventoryForm({
                                                        ...inventoryForm,
                                                        piecesStored: 0,
                                                        piecesIssued: 1,
                                                        piecesDropped: 0
                                                    } as IDetailInventoryItem);
                                                } else {
                                                    setInventoryForm({
                                                        ...inventoryForm,
                                                        piecesIssued: Number(val)
                                                    } as IDetailInventoryItem);
                                                }
                                            }
                                            setIsPiecesCorrect(true);
                                            setIsIssuedError(false);
                                        }}
                                        isError={!isPiecesCorrect || isIssuedError}
                                        isDisabled={true}
                                        type="number"
                                    />
                                </Box>
                            </Tooltip>
                            <Tooltip
                                title={!isDisabled ? "Zum Ändern die Funktion 'Ausscheiden starten' verwenden." : undefined}
                                followCursor={true}
                                enterDelay={500}
                            >
                                <Box /* necessary for showing tooltip */>
                                    <CustomTextField
                                        label="Stückzahl ausgeschieden"
                                        value={inventoryForm.piecesDropped}
                                        setValue={(val) => {
                                            if (Number(val) <= 0) {
                                                setInventoryForm({
                                                    ...inventoryForm,
                                                    piecesDropped: 0
                                                } as IDetailInventoryItem);
                                            } else {
                                                if (isSinglePieceItem) {
                                                    setInventoryForm({
                                                        ...inventoryForm,
                                                        piecesStored: 0,
                                                        piecesIssued: 0,
                                                        piecesDropped: 1
                                                    } as IDetailInventoryItem);
                                                } else {
                                                    setInventoryForm({
                                                        ...inventoryForm,
                                                        piecesDropped: Number(val)
                                                    } as IDetailInventoryItem);
                                                }
                                            }
                                            setIsPiecesCorrect(true);
                                            setIsDroppedError(false);
                                        }}
                                        isError={!isPiecesCorrect || isDroppedError}
                                        isDisabled={true}
                                        type="number"
                                    />
                                </Box>
                            </Tooltip>
                            <Tooltip
                                title={!isDisabled ? "Zum Ändern die Funktion 'Ausgabe starten' oder 'Rücknahme starten' verwenden." : undefined}
                                followCursor={true}
                                enterDelay={500}
                            >
                                <Box /* necessary for showing tooltip */>
                                    <CustomTextField
                                        label="Ausgegeben an"
                                        value={inventoryForm.issuedTo}
                                        setValue={(val) => {
                                            setInventoryForm({ ...inventoryForm, issuedTo: val } as IDetailInventoryItem);
                                            setIsIssuedError(false);
                                        }}
                                        isMultiline={!isSinglePieceItem}
                                        isError={isIssuedError}
                                        isDisabled={true}
                                    />
                                </Box>
                            </Tooltip>
                            {isSinglePieceItem && (
                                <>
                                    <Tooltip
                                        title={!isDisabled ? "Zum Ändern die Funktion 'Ausgabe starten' oder 'Rücknahme starten' verwenden." : undefined}
                                        followCursor={true}
                                        enterDelay={500}
                                    >
                                        <Box /* necessary for showing tooltip */>
                                            <CustomDatePicker
                                                label="Ausgabedatum"
                                                value={inventoryForm.issueDate}
                                                setValue={(val) => {
                                                    setInventoryForm({
                                                        ...inventoryForm,
                                                        issueDate: val?.toString()
                                                    } as IDetailInventoryItem);
                                                    setIsIssuedError(false);
                                                }}
                                                isError={isIssuedError}
                                                isDisabled={true}
                                            />
                                        </Box>
                                    </Tooltip>
                                    <Tooltip
                                        title={!isDisabled ? "Zum Ändern die Funktion 'Ausscheiden starten' verwenden." : undefined}
                                        followCursor={true}
                                        enterDelay={500}
                                    >
                                        <Box /* necessary for showing tooltip */>
                                            <CustomDatePicker
                                                label="Ausscheidedatum"
                                                value={inventoryForm.droppingDate}
                                                setValue={(val) => {
                                                    setInventoryForm({
                                                        ...inventoryForm,
                                                        droppingDate: val?.toString()
                                                    } as IDetailInventoryItem);
                                                    setIsDroppedError(false);
                                                }}
                                                isError={isDroppedError}
                                                isDisabled={true}
                                            />
                                        </Box>
                                    </Tooltip>
                                </>
                            )}
                            <Tooltip
                                title={!isDisabled ? "Zum Ändern die Funktion 'Ausscheiden starten' verwenden." : undefined}
                                followCursor={true}
                                enterDelay={500}
                            >
                                <Box /* necessary for showing tooltip */>
                                    <CustomTextField
                                        label="Ausscheidegrund"
                                        value={inventoryForm.droppingReason}
                                        setValue={(val) => {
                                            setInventoryForm({
                                                ...inventoryForm,
                                                droppingReason: val
                                            } as IDetailInventoryItem);
                                            setIsDroppedError(false);
                                        }}
                                        isMultiline={!isSinglePieceItem}
                                        isError={isDroppedError}
                                        isDisabled={true}
                                    />
                                </Box>
                            </Tooltip>
                        </>
                    )}
                    <CustomTextField
                        label="Anmerkungen"
                        value={inventoryForm.comments}
                        setValue={(val) => {
                            setInventoryForm({ ...inventoryForm, comments: val } as IDetailInventoryItem);
                        }}
                        isError={false}
                        isMultiline={true}
                        isDisabled={isDisabled}
                    />
                    {(isAdmin || isSuperAdmin) && department && (
                        <CustomAutocomplete
                            options={department}
                            optionKey="departmentName"
                            label="Abteilung"
                            value={inventoryForm.department?.departmentName ?? ''}
                            setValue={(val) => {
                                setInventoryForm({ ...inventoryForm, department: val } as IDetailInventoryItem);
                            }}
                            isError={formValidation.find((field) => field.name === 'department')?.error ?? false}
                            isRequired={true}
                            isDisabled={isDisabled}
                        />
                    )}
                    {!isDisabled && (
                        <Grid
                            container
                            paddingTop="16px"
                        >
                            <ImageUpload
                                setPictures={(pictureList) => {
                                    setInventoryForm({
                                        ...inventoryForm,
                                        pictures: [...pictureList]
                                    } as IDetailInventoryItem);
                                }}
                                pictureList={pictureList}
                                setPictureList={setPictureList}
                                isDisabled={isDisabled}
                            />
                        </Grid>
                    )}
                    {formValidation.some((field) => field.error) && (
                        <CustomAlert
                            state="error"
                            message="Pflichtfelder beachten!"
                        />
                    )}
                    {!isPiecesCorrect && (
                        <CustomAlert
                            state="error"
                            message={'"Stückzahl lagernd" / "ausgegeben" / "ausgeschieden" muss "Stückzahl gesamt" entsprechen!'}
                        />
                    )}
                    {isDroppedError && (
                        <CustomAlert
                            state="error"
                            message={
                                inventoryForm.piecesDropped > 0
                                    ? 'Bitte die Felder "Ausscheidedatum" und "Ausscheidegrund" ausfüllen!'
                                    : 'Bitte die Felder Ausscheidedatum und Ausscheidegrund leeren!'
                            }
                        />
                    )}
                    {isIssuedError && (
                        <CustomAlert
                            state="error"
                            message={
                                inventoryForm.piecesIssued > 0
                                    ? 'Bitte die Felder "Ausgegeben an" und "Ausgabedatum" ausfüllen!'
                                    : 'Bitte die Felder "Ausgegeben an" und "Ausgabedatum" leeren!'
                            }
                        />
                    )}
                    <Box sx={{ my: 5.5 }} />
                    {!isDisabled && (
                        <CustomButton
                            label={preFilledValues ? 'Absenden' : 'Erfassen'}
                            onClick={onSend}
                            symbol={preFilledValues ? <CheckCircle /> : <Add />}
                            isDisabled={isDisabled}
                        />
                    )}
                    {isShowIssueDropReturnForm && !isInitialCreation && inventoryForm.active && inventoryForm.pieces !== inventoryForm.piecesDropped && (
                        <Grid
                            container
                            direction="column"
                        >
                            {isDisabled && <Box my={1} />}
                            <CustomDivider />
                            <IssueReturnDropForm
                                inventoryForm={inventoryForm}
                                onFormSent={onFormSent}
                                isSinglePieceItem={isSinglePieceItem}
                                isDisabled={isDisabled}
                            />
                        </Grid>
                    )}
                </>
            )}
        </Grid>
    );
}
