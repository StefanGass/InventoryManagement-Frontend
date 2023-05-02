import { GenericObject, ICategory, ILocation, IObjectToSend, IPrinter, ISupplier, IType } from 'components/interfaces';
import { FC, MouseEvent, useContext, useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import CustomTextField from 'components/form-fields/CustomTextField';
import CustomAutocomplete from 'components/form-fields/CustomAutocomplete';
import { Add } from '@mui/icons-material';
import DataTableType from 'components/tables/DataTableType';
import DataTableCategory from 'components/tables/DataTableCategory';
import DataTableLocation from 'components/tables/DataTableLocation';
import DataTableSupplier from 'components/tables/DataTableSupplier';
import CustomButton from 'components/form-fields/CustomButton';
import DataTablePrinter from 'components/tables/DataTablePrinter';
import { UserContext } from 'pages/_app';
import CustomAlert from 'components/form-fields/CustomAlert';
import ParameterDroppingReviewer from "components/forms/ParameterDroppingReviewer";

interface IPropertyForm {
    parameter: number | null;
    tableList: ICategory[] | IType[] | ISupplier[] | ILocation[] | IPrinter[];
    categoryOptions: ICategory[];
    addSuccessfulAlert: boolean;
    duplicateErrorAlert: boolean;
    onClick: (e: MouseEvent<HTMLButtonElement>, objectToSend: IObjectToSend | null, tableToFetch: string) => void;
    setAddedSuccessfulAlert: (bool: boolean) => void;
    setDuplicateErrorAlert: (bool: boolean) => void;
}

const ParameterForm: FC<IPropertyForm> = (props) => {
    const { parameter, tableList, onClick, addSuccessfulAlert, duplicateErrorAlert, categoryOptions, setAddedSuccessfulAlert, setDuplicateErrorAlert } = props;
    const { admin, superAdmin } = useContext(UserContext);

    const [valueOne, setValueOne] = useState<string>('');
    const [valueTwo, setValueTwo] = useState<string | GenericObject | null>('');
    const [valueOneError, setValueOneError] = useState(false);
    const [valueTwoError, setValueTwoError] = useState(false);
    const [inputEmptyAlert, setInputEmptyAlert] = useState(false);

    useEffect(() => {
        setValueOne('');
        setValueTwo('');
        setValueOneError(false);
        setValueTwoError(false);
        setAddedSuccessfulAlert(false);
        setDuplicateErrorAlert(false);
        setInputEmptyAlert(false);
    }, [parameter]);

    useEffect(() => {
        valueOne && setValueOneError(false);
        valueTwo && setValueTwoError(false);
        setAddedSuccessfulAlert(false);
        setDuplicateErrorAlert(false);
        valueOne && (valueTwo || !valueTwoError) && setInputEmptyAlert(false);
    }, [valueOne, valueTwo]);

    if (!parameter) {
        return null;
    }

    const onButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        setInputEmptyAlert(false);
        setAddedSuccessfulAlert(false);
        setDuplicateErrorAlert(false);
        setValueOneError(false);
        setValueTwoError(false);
        if (valueOne && !/^\s*$/.test(valueOne)) {
            const trimmedValueOne = valueOne.trim();
            let trimmedValueTwo = '';
            if ((parameter === 2 && valueTwo) || (parameter === 4 && valueTwo) || (parameter === 6 && valueTwo)) {
                trimmedValueTwo = valueTwo.trim();
            }
            let tableToFetch: string | null;
            let objectToSend: IObjectToSend | null = null;
            switch (parameter) {
                case 1:
                    tableToFetch = 'type';
                    objectToSend = { typeName: trimmedValueOne, category: valueTwo };
                    break;
                case 2:
                    tableToFetch = 'category';
                    objectToSend = { categoryName: trimmedValueOne, prefix: trimmedValueTwo };
                    break;
                case 3:
                    tableToFetch = 'location';
                    objectToSend = { locationName: trimmedValueOne };
                    break;
                case 4:
                    tableToFetch = 'supplier';
                    objectToSend = { supplierName: trimmedValueOne, link: trimmedValueTwo };
                    break;
                case 5:
                    tableToFetch = 'department';
                    objectToSend = { departmentName: trimmedValueOne };
                    break;
                case 6:
                    tableToFetch = 'printer';
                    objectToSend = { printerName: trimmedValueOne, printerIp: trimmedValueTwo };
                    break;
                default:
                    tableToFetch = '';
                    break;
            }
            if ((parameter !== 1 && parameter !== 2 && parameter !== 6) || valueTwo) {
                if (parameter === 2 && trimmedValueTwo) {
                    if (trimmedValueTwo.length >= 2 && trimmedValueTwo.length <= 6 && trimmedValueTwo.match(/^[a-z0-9]+$/i)) {
                        onClick(e, objectToSend, tableToFetch);
                        setValueOne('');
                        setValueTwo('');
                    } else {
                        setInputEmptyAlert(true);
                        setValueTwoError(true);
                    }
                } else {
                    onClick(e, objectToSend, tableToFetch);
                    setValueOne('');
                    setValueTwo('');
                }
            } else {
                setInputEmptyAlert(true);
                setValueTwoError(true);
            }
        } else {
            setInputEmptyAlert(true);
            setValueOneError(true);
            if ((parameter === 1 && !valueTwo) || (parameter === 2 && !valueTwo) || (parameter === 6 && !valueTwo)) {
                setValueTwoError(true);
            } else {
                setValueTwoError(false);
            }
        }
    };

    const renderTable = (param: number) => {
        switch (param) {
            case 1:
                return <DataTableType typeList={tableList as IType[]} />;
            case 2:
                return <DataTableCategory categoryList={tableList as ICategory[]} />;
            case 3:
                return <DataTableLocation locationList={tableList as ILocation[]} />;
            case 4:
                return <DataTableSupplier supplierList={tableList as ISupplier[]} />;
            case 6:
                return <DataTablePrinter printerList={tableList as IPrinter[]} />;
            case 7:
                return <ParameterDroppingReviewer />;
            default:
                return null;
        }
    };
    return (
        <Grid
            container
            justifyContent="center"
        >
            <Grid item>
                <Box sx={{ my: 4 }} />
                <Typography
                    variant="h2"
                    align="center"
                >
                    Neu anlegen
                </Typography>
                <Box sx={{ my: 2 }} />
                <CustomTextField
                    label="Bezeichnung"
                    value={valueOne}
                    setValue={setValueOne}
                    required={true}
                    error={valueOneError}
                />
                {parameter === 1 && (
                    <CustomAutocomplete
                        options={categoryOptions}
                        optionKey="categoryName"
                        label="Kategorie"
                        value={valueTwo?.['categoryName'] ?? ''}
                        setValue={setValueTwo}
                        required={true}
                        error={valueTwoError}
                    />
                )}
                {parameter === 2 && (
                    <CustomTextField
                        label="Präfix für Inventarnummer"
                        value={valueTwo}
                        setValue={setValueTwo}
                        error={valueTwoError}
                        required={true}
                        helperText={'2-6 Zeichen, keine Sonderzeichen'}
                    />
                )}
                {parameter === 4 && (
                    <CustomTextField
                        label="Link"
                        value={valueTwo}
                        setValue={setValueTwo}
                        error={valueTwoError}
                    />
                )}
                {parameter === 6 && (
                    <CustomTextField
                        label="IP-Adresse"
                        value={valueTwo}
                        setValue={setValueTwo}
                        error={valueTwoError}
                        required={true}
                        disabled={!admin && !superAdmin}
                    />
                )}
                {addSuccessfulAlert && (
                    <CustomAlert
                        state="success"
                        message="Parameter erfolgreich angelegt!"
                    />
                )}
                {inputEmptyAlert && (
                    <CustomAlert
                        state="error"
                        message="Pflichtfelder beachten!"
                    />
                )}
                {duplicateErrorAlert && (
                    <CustomAlert
                        state="error"
                        message="Parameter existiert bereits!"
                    />
                )}
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <CustomButton
                        onClick={onButtonClick}
                        label="Anlegen"
                        symbol={<Add />}
                    />
                </Grid>
            </Grid>
            {parameter !== 5 && (
                <Grid
                    container
                    justifyContent="center"
                >
                    <Box sx={{ my: 5.5 }} />
                    <Typography
                        variant="h2"
                        align="center"
                        marginTop="1.5em"
                    >
                        Übersicht
                    </Typography>
                    <Box sx={{ my: 3 }} />
                </Grid>
            )}
            <Grid
                item
                height="auto"
                width="95%"
                margin="auto"
            >
                {renderTable(parameter)}
            </Grid>
        </Grid>
    );
};

export default ParameterForm;
