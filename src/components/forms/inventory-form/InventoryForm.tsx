import { FC, useContext, useEffect, useState } from 'react';
import { IDepartment, IDetailInventoryItem, ILocation, IPrinter, ISupplier, IType } from 'components/interfaces';
import { Box, Container, Grid, Typography } from '@mui/material';
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
import { UserContext } from 'pages/_app';
import LoadingSpinner from 'components/layout/LoadingSpinner';
import CustomDivider from 'components/layout/CustomDivider';
import IssueReturnDropForm from 'components/forms/inventory-form/IssueReturnDropForm';
import CustomAlert from 'components/form-fields/CustomAlert';

interface IInventoryFormProps {
    type: IType[];
    supplier: ISupplier[];
    location: ILocation[];
    printer: IPrinter[];
    department?: IDepartment[];
    preFilledValues?: IDetailInventoryItem;
    disabled?: boolean;
    onFormSent: (...params) => void;
    initialCreation?: boolean;
}

const InventoryForm: FC<IInventoryFormProps> = (props) => {
    const { type, location, supplier, printer, department, preFilledValues, disabled, onFormSent, initialCreation } = props;

    const { userId, admin, superAdmin } = useContext(UserContext);
    const isFirstRender = useIsFirstRender();

    const [inventoryForm, setInventoryForm] = useState<IDetailInventoryItem>(
        preFilledValues
            ? {
                  ...preFilledValues,
                  pictures: undefined
              }
            : JSON.parse(JSON.stringify(defaultInventory))
    );
    const [isSinglePieceItem, setIsSinglePieceItem] = useState(false);
    const [formValidation, setFormValidation] = useState(JSON.parse(JSON.stringify(inventoryFormRequiredSchema)));
    const [piecesCorrect, setPiecesCorrect] = useState(true);
    const [issuedFormValidation, setIssuedFormValidation] = useState(JSON.parse(JSON.stringify(issuedSchema)));
    const [issuedError, setIssuedError] = useState(false);
    const [droppedFormValidation, setDroppedFormValidation] = useState(JSON.parse(JSON.stringify(droppedSchema)));
    const [droppedError, setDroppedError] = useState(false);
    const [isSend, setIsSend] = useState(false);
    const [askAgain, setAskAgain] = useState(false);
    const [reloadDepartmentAfterAddingInventoryItem, setReloadDepartmentAfterAddingInventoryItem] = useState(false);
    const [loading, setLoading] = useState(false);
    const [itemIsDropped] = useState(inventoryForm.pieces !== inventoryForm.piecesDropped);

    useEffect(() => {
        if (!isFirstRender && isSend) {
            useFormValidation(inventoryForm, formValidation, setFormValidation);
            useFormValidation(inventoryForm, droppedFormValidation, setDroppedFormValidation);
            useFormValidation(inventoryForm, issuedFormValidation, setIssuedFormValidation);
        }
        if (isFirstRender) {
            if (inventoryForm && inventoryForm.pieces && inventoryForm.pieces === 1 && !initialCreation) {
                setIsSinglePieceItem(true);
            }
        }
    }, [inventoryForm]);

    useEffect(() => {
        if (initialCreation) {
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
                            .catch((error) => {
                                console.log(error.message);
                            });
                    }
                })
                .catch((error) => {
                    console.log(error);
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
            setPiecesCorrect(true);
            setIssuedError(false);
            setDroppedError(false);
        }
    }, [disabled]);

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
                    setLoading(false);
                } else {
                    setInventoryForm({ ...inventoryForm, itemInternalNumber: 'ERROR' } as IDetailInventoryItem);
                }
            })
            .catch(() => {
                setInventoryForm({ ...inventoryForm, itemInternalNumber: 'ERROR' } as IDetailInventoryItem);
            });
    }

    useEffect(() => {
        if (initialCreation) {
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

    if (!type || !location || !supplier || ((admin || superAdmin) && !department)) {
        // maybe give an info message instead of null
        return null;
    }

    const onSend = async () => {
        setLoading(true);
        setIsSend(true);
        const error = useFormValidation(inventoryForm, formValidation, setFormValidation);
        const correctPieces =
            inventoryForm.pieces === inventoryForm?.piecesStored + inventoryForm?.piecesDropped + inventoryForm?.piecesIssued &&
            inventoryForm.pieces >= 0 &&
            inventoryForm.piecesStored >= 0 &&
            inventoryForm.piecesDropped >= 0 &&
            inventoryForm.piecesIssued >= 0;
        setPiecesCorrect(correctPieces);
        const dropError = useFormValidation(inventoryForm, droppedFormValidation, setDroppedFormValidation, true);
        setDroppedError(dropError);
        const issueError = useFormValidation(inventoryForm, issuedFormValidation, setIssuedFormValidation, true);
        setIssuedError(issueError);
        if (!error && correctPieces && !dropError && !issueError) {
            await onFormSent(inventoryForm, setAskAgain, setInventoryForm);
            if (initialCreation) {
                setIsSend(false);
            }
        }
        if (initialCreation || error || !correctPieces || dropError || issueError) {
            setLoading(false);
        }
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
    } else {
        return (
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="top"
            >
                {askAgain ? (
                    <AskAgainFormGroup
                        inventoryItem={inventoryForm}
                        refreshInternalNumber={refreshInternalNumber}
                        setAskAgain={setAskAgain}
                        setReloadDepartment={setReloadDepartmentAfterAddingInventoryItem}
                        setDefaultForm={() => setInventoryForm(JSON.parse(JSON.stringify(defaultInventory)))}
                        printer={printer}
                    />
                ) : (
                    <>
                        {initialCreation && (
                            <Container>
                                <Typography
                                    variant="h1"
                                    align="center"
                                    gutterBottom
                                    id="inventargegenstandErfassenHeader"
                                >
                                    Inventargegenstand erfassen
                                </Typography>
                                <Box sx={{ my: 3 }} />
                            </Container>
                        )}
                        <CustomAutocomplete
                            options={type}
                            optionKey="typeName"
                            label="Typ"
                            value={inventoryForm.type?.typeName ?? ''}
                            setValue={(val) => {
                                setInventoryForm({ ...inventoryForm, type: val } as IDetailInventoryItem);
                            }}
                            error={formValidation.find((field) => field.name === 'type')?.error ?? false}
                            required={true}
                            disabled={!!preFilledValues}
                        />
                        <CustomTextField
                            label={initialCreation ? 'Voraussichtliche Inventarnummer' : 'Inventarnummer'}
                            value={inventoryForm.itemInternalNumber}
                            setValue={(val) => {
                                setInventoryForm({ ...inventoryForm, itemInternalNumber: val } as IDetailInventoryItem);
                            }}
                            error={false}
                            required={true}
                            disabled={true}
                        />
                        <CustomTextField
                            label="Beschreibung"
                            value={inventoryForm.itemName}
                            setValue={(val) => {
                                setInventoryForm({ ...inventoryForm, itemName: val } as IDetailInventoryItem);
                            }}
                            disabled={disabled}
                        />
                        <CustomTextField
                            label="Alte Inventarnummer"
                            value={inventoryForm.oldItemNumber}
                            setValue={(val) => {
                                setInventoryForm({ ...inventoryForm, oldItemNumber: val } as IDetailInventoryItem);
                            }}
                            error={false}
                            disabled={disabled}
                        />
                        <CustomTextField
                            label="Seriennummer"
                            value={inventoryForm.serialNumber}
                            setValue={(val) => {
                                setInventoryForm({ ...inventoryForm, serialNumber: val } as IDetailInventoryItem);
                            }}
                            disabled={disabled}
                        />
                        <CustomAutocomplete
                            options={location}
                            optionKey="locationName"
                            label="Standort"
                            value={inventoryForm.location?.locationName ?? ''}
                            setValue={(val) => {
                                setInventoryForm({ ...inventoryForm, location: val } as IDetailInventoryItem);
                            }}
                            error={formValidation.find((field) => field.name === 'location')?.error ?? false}
                            required={true}
                            disabled={disabled}
                        />
                        <CustomAutocomplete
                            options={supplier}
                            optionKey="supplierName"
                            label="Lieferant"
                            value={inventoryForm.supplier?.supplierName ?? ''}
                            setValue={(val) => {
                                setInventoryForm({ ...inventoryForm, supplier: val } as IDetailInventoryItem);
                            }}
                            error={formValidation.find((field) => field.name === 'supplier')?.error ?? false}
                            required={true}
                            disabled={disabled}
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
                            disabled={disabled}
                        />
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
                                    if (initialCreation) {
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
                                setPiecesCorrect(true);
                            }}
                            error={(formValidation.find((field) => field.name === 'pieces')?.error ?? false) || !piecesCorrect}
                            required={true}
                            disabled={disabled || isSinglePieceItem}
                            type="number"
                        />
                        {!initialCreation && (
                            <>
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
                                        setPiecesCorrect(true);
                                    }}
                                    error={!piecesCorrect}
                                    disabled={disabled || !isSinglePieceItem}
                                    type="number"
                                />
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
                                        setPiecesCorrect(true);
                                        setIssuedError(false);
                                    }}
                                    error={!piecesCorrect || issuedError}
                                    disabled={disabled || !isSinglePieceItem}
                                    type="number"
                                />
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
                                        setPiecesCorrect(true);
                                        setDroppedError(false);
                                    }}
                                    error={!piecesCorrect || droppedError}
                                    disabled={disabled || !isSinglePieceItem}
                                    type="number"
                                />
                                <CustomTextField
                                    label="Ausgegeben an"
                                    value={inventoryForm.issuedTo}
                                    setValue={(val) => {
                                        setInventoryForm({ ...inventoryForm, issuedTo: val } as IDetailInventoryItem);
                                        setIssuedError(false);
                                    }}
                                    multiline={!isSinglePieceItem}
                                    error={issuedError}
                                    disabled={disabled || !isSinglePieceItem}
                                />
                                {isSinglePieceItem && (
                                    <>
                                        <CustomDatePicker
                                            label="Ausgabedatum"
                                            value={inventoryForm.issueDate}
                                            setValue={(val) => {
                                                setInventoryForm({
                                                    ...inventoryForm,
                                                    issueDate: val?.toString()
                                                } as IDetailInventoryItem);
                                                setIssuedError(false);
                                            }}
                                            error={issuedError}
                                            disabled={disabled}
                                        />
                                        <CustomDatePicker
                                            label="Ausscheidedatum"
                                            value={inventoryForm.droppingDate}
                                            setValue={(val) => {
                                                setInventoryForm({
                                                    ...inventoryForm,
                                                    droppingDate: val?.toString()
                                                } as IDetailInventoryItem);
                                                setDroppedError(false);
                                            }}
                                            error={droppedError}
                                            disabled={disabled}
                                        />
                                    </>
                                )}
                                <CustomTextField
                                    label="Ausscheidegrund"
                                    value={inventoryForm.droppingReason}
                                    setValue={(val) => {
                                        setInventoryForm({
                                            ...inventoryForm,
                                            droppingReason: val
                                        } as IDetailInventoryItem);
                                        setDroppedError(false);
                                    }}
                                    multiline={!isSinglePieceItem}
                                    error={droppedError}
                                    disabled={disabled || !isSinglePieceItem}
                                />
                            </>
                        )}
                        <CustomTextField
                            label="Anmerkungen"
                            value={inventoryForm.comments}
                            setValue={(val) => {
                                setInventoryForm({ ...inventoryForm, comments: val } as IDetailInventoryItem);
                            }}
                            error={false}
                            multiline={true}
                            disabled={disabled}
                        />
                        {(admin || superAdmin) && department && (
                            <CustomAutocomplete
                                options={department}
                                optionKey="departmentName"
                                label="Abteilung"
                                value={inventoryForm.department?.departmentName ?? ''}
                                setValue={(val) => {
                                    setInventoryForm({ ...inventoryForm, department: val } as IDetailInventoryItem);
                                }}
                                error={formValidation.find((field) => field.name === 'department')?.error ?? false}
                                required={true}
                                disabled={disabled}
                            />
                        )}
                        {!disabled && (
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
                                    disabled={disabled}
                                />
                            </Grid>
                        )}
                        {formValidation.some((field) => field.error) && (
                            <CustomAlert
                                state="error"
                                message="Pflichtfelder beachten!"
                            />
                        )}
                        {!piecesCorrect && (
                            <CustomAlert
                                state="error"
                                message={'"Stückzahl lagernd" / "ausgegeben" / "ausgeschieden" muss "Stückzahl gesamt" entsprechen!'}
                            />
                        )}
                        {droppedError && (
                            <CustomAlert
                                state="error"
                                message={
                                    inventoryForm.piecesDropped > 0
                                        ? 'Bitte die Felder "Ausscheidedatum" und "Ausscheidegrund" ausfüllen!'
                                        : 'Bitte die Felder Ausscheidedatum und Ausscheidegrund leeren!'
                                }
                            />
                        )}
                        {issuedError && (
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
                        {!disabled && (
                            <CustomButton
                                label={preFilledValues ? 'Absenden' : 'Erfassen'}
                                onClick={onSend}
                                symbol={preFilledValues ? <CheckCircle /> : <Add />}
                                disabled={disabled}
                            />
                        )}
                        {!initialCreation && inventoryForm.active && itemIsDropped && (
                            <Container>
                                <Grid
                                    marginTop={disabled ? '2.5em' : '2em'}
                                    marginBottom="2em"
                                >
                                    <CustomDivider />
                                </Grid>
                                <IssueReturnDropForm
                                    inventoryForm={inventoryForm}
                                    onFormSent={onFormSent}
                                    isSinglePieceItem={isSinglePieceItem}
                                    disabled={disabled}
                                />
                            </Container>
                        )}
                    </>
                )}
            </Grid>
        );
    }
};

export default InventoryForm;
