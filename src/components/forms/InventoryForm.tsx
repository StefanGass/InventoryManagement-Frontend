import { FC, useContext, useEffect, useState } from 'react';
import { IDepartment, IDetailInventoryItem, ILocation, ISupplier, IType } from 'components/interfaces';
import { Alert, Box, Container, Grid, Stack } from '@mui/material';
import CustomAutocomplete from 'components/form-fields/CustomAutocomplete';
import { Add, Cancel, CheckCircle } from '@mui/icons-material';
import CustomTextField from 'components/form-fields/CustomTextField';
import ImageUpload from 'components/image-upload/ImageUpload';
import CustomDatePicker from 'components/form-fields/CustomDatePicker';
import useFormValidation from 'hooks/useFormValidation';
import useIsFirstRender from 'hooks/useIsFirstRender';
import CustomButton from 'components/form-fields/CustomButton';
import { useRouter } from 'next/router';
import { defaultInventory, droppedSchema, inventoryFormRequiredSchema, issuedSchema } from 'components/forms/inventoryFormDefaultValues';
import AskAgainFormGroup from 'components/form-fields/AskAgainFormGroup';
import { UserContext } from 'pages/_app';
import LoadingSpinner from 'components/layout/LoadingSpinner';

interface IInventoryFormProps {
    type: IType[];
    supplier: ISupplier[];
    location: ILocation[];
    department: IDepartment[];
    preFilledValues?: IDetailInventoryItem;
    disabled?: boolean;
    onFormSent: (...params) => void;
}

const InventoryForm: FC<IInventoryFormProps> = (props) => {
    const { type, location, supplier, department, preFilledValues, disabled, onFormSent } = props;
    const [inventoryForm, setInventoryForm] = useState<IDetailInventoryItem>(
        preFilledValues
            ? {
                  ...preFilledValues,
                  pictures: undefined
              }
            : JSON.parse(JSON.stringify(defaultInventory))
    );
    const [formValidation, setFormValidation] = useState(JSON.parse(JSON.stringify(inventoryFormRequiredSchema)));
    const [isSend, setIsSend] = useState(false);
    const [piecesCorrect, setPiecesCorrect] = useState(true);
    const [droppedFormValidation, setDroppedFormValidation] = useState(JSON.parse(JSON.stringify(droppedSchema)));
    const [droppedError, setDroppedError] = useState(false);
    const [issuedFormValidation, setIssuedFormValidation] = useState(JSON.parse(JSON.stringify(issuedSchema)));
    const [issuedError, setIssuedError] = useState(false);
    const [askAgain, setAskAgain] = useState(false);
    const [loading, setLoading] = useState(false);

    const { superAdmin } = useContext(UserContext);

    const isFirstRender = useIsFirstRender();
    const router = useRouter();

    useEffect(() => {
        if (!isFirstRender && isSend) {
            useFormValidation(inventoryForm, formValidation, setFormValidation);
            useFormValidation(inventoryForm, droppedFormValidation, setDroppedFormValidation);
            useFormValidation(inventoryForm, issuedFormValidation, setIssuedFormValidation);
        }
    }, [inventoryForm]);

    if (!type || !location || !supplier || !department) {
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
            setIsSend(false);
        }
        setLoading(false);
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
                alignItems="center"
            >
                {askAgain ? (
                    <AskAgainFormGroup
                        setAskAgain={setAskAgain}
                        setDefaultForm={() => setInventoryForm(JSON.parse(JSON.stringify(defaultInventory)))}
                    />
                ) : (
                    <>
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
                            disabled={disabled}
                        />
                        <CustomTextField
                            label="Inventarnummer"
                            value={inventoryForm.itemInternalNumber}
                            setValue={(val) => {
                                setInventoryForm({ ...inventoryForm, itemInternalNumber: val } as IDetailInventoryItem);
                            }}
                            error={formValidation.find((field) => field.name === 'itemInternalNumber')?.error ?? false}
                            required={true}
                            disabled={!!preFilledValues}
                        />
                        <CustomTextField
                            label="Bezeichnung"
                            value={inventoryForm.itemName}
                            setValue={(val) => {
                                setInventoryForm({ ...inventoryForm, itemName: val } as IDetailInventoryItem);
                            }}
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
                            options={department}
                            optionKey="departmentName"
                            label="Abteilung"
                            value={inventoryForm.department?.departmentName ?? ''}
                            setValue={(val) => {
                                setInventoryForm({ ...inventoryForm, department: val } as IDetailInventoryItem);
                            }}
                            error={formValidation.find((field) => field.name === 'department')?.error ?? false}
                            required={true}
                            disabled={superAdmin ? disabled : !!preFilledValues}
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
                            label="Stückzahl"
                            value={inventoryForm.pieces}
                            setValue={(val) => {
                                setInventoryForm({
                                    ...inventoryForm,
                                    pieces: Number(val),
                                    piecesStored: Number(val)
                                } as IDetailInventoryItem);
                            }}
                            error={(formValidation.find((field) => field.name === 'pieces')?.error ?? false) || !piecesCorrect}
                            required={true}
                            disabled={disabled}
                            type="number"
                        />
                        <CustomTextField
                            label="Stückzahl lagernd"
                            value={inventoryForm.piecesStored}
                            setValue={(val) => {
                                setInventoryForm({
                                    ...inventoryForm,
                                    piecesStored: Number(val)
                                } as IDetailInventoryItem);
                                setPiecesCorrect(true);
                            }}
                            error={!piecesCorrect}
                            disabled={disabled}
                            type="number"
                        />
                        <CustomTextField
                            label="Stückzahl ausgegeben"
                            value={inventoryForm.piecesIssued}
                            setValue={(val) => {
                                setInventoryForm({
                                    ...inventoryForm,
                                    piecesIssued: Number(val)
                                } as IDetailInventoryItem);
                                setPiecesCorrect(true);
                            }}
                            error={!piecesCorrect || issuedError}
                            disabled={disabled}
                            type="number"
                        />
                        <CustomTextField
                            label="Stückzahl ausgeschieden"
                            value={inventoryForm.piecesDropped}
                            setValue={(val) => {
                                setInventoryForm({
                                    ...inventoryForm,
                                    piecesDropped: Number(val)
                                } as IDetailInventoryItem);
                                setPiecesCorrect(true);
                            }}
                            error={!piecesCorrect || droppedError}
                            disabled={disabled}
                            type="number"
                        />
                        <CustomTextField
                            label="Ausgegeben an"
                            value={inventoryForm.issuedTo}
                            setValue={(val) => {
                                setInventoryForm({ ...inventoryForm, issuedTo: val } as IDetailInventoryItem);
                            }}
                            error={issuedError}
                            disabled={disabled}
                        />
                        <CustomDatePicker
                            label="Ausgabedatum"
                            value={inventoryForm.issueDate}
                            setValue={(val) =>
                                setInventoryForm({
                                    ...inventoryForm,
                                    issueDate: val?.toString()
                                } as IDetailInventoryItem)
                            }
                            error={issuedError}
                            disabled={disabled}
                        />
                        <CustomDatePicker
                            label="Ausscheidedatum"
                            value={inventoryForm.droppingDate}
                            setValue={(val) =>
                                setInventoryForm({
                                    ...inventoryForm,
                                    droppingDate: val?.toString()
                                } as IDetailInventoryItem)
                            }
                            error={droppedError}
                            disabled={disabled}
                        />
                        <CustomTextField
                            label="Ausscheidegrund"
                            value={inventoryForm.droppingReason}
                            setValue={(val) => {
                                setInventoryForm({ ...inventoryForm, droppingReason: val } as IDetailInventoryItem);
                            }}
                            error={droppedError}
                            disabled={disabled}
                        />
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
                        {(!piecesCorrect || droppedError || issuedError || formValidation.some((field) => field.error)) && (
                            <Container
                                sx={{
                                    display: 'flex',
                                    flexFlow: 'column nowrap',
                                    alignItems: 'center'
                                }}
                            >
                                <Stack
                                    sx={{
                                        width: '17em',
                                        marginTop: '0.8em',
                                        marginBottom: '0.5em'
                                    }}
                                    spacing={2}
                                >
                                    {formValidation.some((field) => field.error) && <Alert severity="error">Pflichtfelder beachten!</Alert>}
                                    {!piecesCorrect && (
                                        <Alert severity="error">
                                            Stück lagernd / ausgegeben / ausgeschieden muss Stückzahl gesamt entsprechen und positiv sein!
                                        </Alert>
                                    )}
                                    {droppedError && (
                                        <Alert severity="error">Bitte alle Ausscheidefelder ausfüllen, wenn mindestens eines ausgefüllt ist!</Alert>
                                    )}
                                    {issuedError && <Alert severity="error">Bitte alle Ausgebefelder ausfüllen, wenn mindestens eines ausgefüllt ist!</Alert>}
                                </Stack>
                            </Container>
                        )}
                        <Box sx={{ my: 5.5 }} />
                        <CustomButton
                            label={preFilledValues ? 'Abschicken' : 'Erfassen'}
                            onClick={onSend}
                            symbol={preFilledValues ? <CheckCircle /> : <Add />}
                            disabled={disabled}
                        />
                        {!preFilledValues && (
                            <CustomButton
                                label="Abbrechen"
                                onClick={() => router.replace('/')}
                                symbol={<Cancel />}
                                disabled={disabled}
                            />
                        )}
                    </>
                )}
            </Grid>
        );
    }
};

export default InventoryForm;
