import { GenericObject, ICategory, IDepartment, ILocation, IObjectToSend, IPrinter, ISupplier, IType } from 'components/interfaces';
import { MouseEvent, useContext, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import CustomTextField from 'components/form-fields/CustomTextField';
import CustomAutocomplete from 'components/form-fields/CustomAutocomplete';
import { Add } from '@mui/icons-material';
import DataTableType from 'components/tables/DataTableType';
import DataTableCategory from 'components/tables/DataTableCategory';
import DataTableLocation from 'components/tables/DataTableLocation';
import DataTableSupplier from 'components/tables/DataTableSupplier';
import CustomButton from 'components/form-fields/CustomButton';
import DataTablePrinter from 'components/tables/DataTablePrinter';
import { UserContext } from '../../../pages/_app';
import CustomAlert from 'components/form-fields/CustomAlert';
import DataTableDepartment from 'components/tables/DataTableDepartment';
import CustomHeading2 from 'components/layout/CustomHeading2';

interface IPropertyForm {
    parameter: string;
    tableList: ICategory[] | IType[] | ISupplier[] | ILocation[] | IDepartment[] | IPrinter[];
    categoryOptions: ICategory[];
    addSuccessfulAlert: boolean;
    duplicateErrorAlert: boolean;
    onClick: (e: MouseEvent<HTMLButtonElement>, objectToSend: IObjectToSend | null, tableToFetch: string) => void;
    setAddedSuccessfulAlert: (bool: boolean) => void;
    setDuplicateErrorAlert: (bool: boolean) => void;
}

export default function ParameterForm(props: IPropertyForm) {
    const { parameter, tableList, onClick, addSuccessfulAlert, duplicateErrorAlert, categoryOptions, setAddedSuccessfulAlert, setDuplicateErrorAlert } = props;
    const { isAdmin, isSuperAdmin } = useContext(UserContext);

    const [valueOne, setValueOne] = useState<string>('');
    const [valueTwo, setValueTwo] = useState<string | GenericObject | null>('');
    const [isValueOneError, setIsValueOneError] = useState(false);
    const [isValueTwoError, setIsValueTwoError] = useState(false);
    const [isInputEmptyAlert, setIsInputEmptyAlert] = useState(false);

    useEffect(() => {
        setValueOne('');
        setValueTwo('');
        setIsValueOneError(false);
        setIsValueTwoError(false);
        setAddedSuccessfulAlert(false);
        setDuplicateErrorAlert(false);
        setIsInputEmptyAlert(false);
    }, [parameter]);

    useEffect(() => {
        valueOne && setIsValueOneError(false);
        valueTwo && setIsValueTwoError(false);
        setAddedSuccessfulAlert(false);
        setDuplicateErrorAlert(false);
        valueOne && (valueTwo || !isValueTwoError) && setIsInputEmptyAlert(false);
    }, [valueOne, valueTwo]);

    if (!parameter) {
        return null;
    }

    function onButtonClick(e: MouseEvent<HTMLButtonElement>) {
        setIsInputEmptyAlert(false);
        setAddedSuccessfulAlert(false);
        setDuplicateErrorAlert(false);
        setIsValueOneError(false);
        setIsValueTwoError(false);
        if (valueOne && !/^\s*$/.test(valueOne) && !/[\/\\]/.test(valueOne)) {
            const trimmedValueOne = valueOne.trim();
            let trimmedValueTwo = '';
            if ((parameter === 'category' && valueTwo) || (parameter === 'supplier' && valueTwo) || (parameter === 'printer' && valueTwo)) {
                trimmedValueTwo = valueTwo.trim();
            }
            let objectToSend: IObjectToSend | null = null;
            switch (parameter) {
                case 'type':
                    objectToSend = { typeName: trimmedValueOne, category: valueTwo };
                    break;
                case 'category':
                    objectToSend = { categoryName: trimmedValueOne, prefix: trimmedValueTwo };
                    break;
                case 'location':
                    objectToSend = { locationName: trimmedValueOne };
                    break;
                case 'supplier':
                    objectToSend = { supplierName: trimmedValueOne, link: trimmedValueTwo };
                    break;
                case 'department':
                    objectToSend = { departmentName: trimmedValueOne };
                    break;
                case 'printer':
                    objectToSend = { printerName: trimmedValueOne, printerIp: trimmedValueTwo };
                    break;
                default:
                    break;
            }
            if ((parameter !== 'type' && parameter !== 'category' && parameter !== 'printer') || valueTwo) {
                if (parameter === 'category' && trimmedValueTwo) {
                    if (trimmedValueTwo.length >= 2 && trimmedValueTwo.length <= 6 && trimmedValueTwo.match(/^[a-z0-9]+$/i)) {
                        onClick(e, objectToSend, parameter);
                        setValueOne('');
                        setValueTwo('');
                    } else {
                        setIsInputEmptyAlert(true);
                        setIsValueTwoError(true);
                    }
                } else {
                    onClick(e, objectToSend, parameter);
                    setValueOne('');
                    setValueTwo('');
                }
            } else {
                setIsInputEmptyAlert(true);
                setIsValueTwoError(true);
            }
        } else {
            setIsInputEmptyAlert(true);
            setIsValueOneError(true);
            if ((parameter === 'type' && !valueTwo) || (parameter === 'category' && !valueTwo) || (parameter === 'printer' && !valueTwo)) {
                setIsValueTwoError(true);
            } else {
                setIsValueTwoError(false);
            }
        }
    }

    function renderTable(param: string) {
        switch (param) {
            case 'type':
                return <DataTableType typeList={tableList as IType[]} />;
            case 'category':
                return <DataTableCategory categoryList={tableList as ICategory[]} />;
            case 'location':
                return <DataTableLocation locationList={tableList as ILocation[]} />;
            case 'supplier':
                return <DataTableSupplier supplierList={tableList as ISupplier[]} />;
            case 'department':
                return <DataTableDepartment departmentList={tableList as IDepartment[]} />;
            case 'printer':
                return <DataTablePrinter printerList={tableList as IPrinter[]} />;
            default:
                return null;
        }
    }

    return (
        <>
            <CustomHeading2 text="Neuen Parameter anlegen" />
            <Box my={0.5} />
            <CustomTextField
                label="Bezeichnung"
                value={valueOne}
                setValue={setValueOne}
                isRequired={true}
                isError={isValueOneError}
                helperText={valueOne && isValueOneError ? '/ und \\ sind hier nicht erlaubt!' : undefined}
            />
            {parameter === 'type' && (
                <CustomAutocomplete
                    options={categoryOptions}
                    optionKey="categoryName"
                    label="Kategorie"
                    value={valueTwo?.['categoryName'] ?? ''}
                    setValue={setValueTwo}
                    isRequired={true}
                    isError={isValueTwoError}
                />
            )}
            {parameter === 'category' && (
                <CustomTextField
                    label="Präfix für Inventarnummer"
                    value={valueTwo}
                    setValue={setValueTwo}
                    isError={isValueTwoError}
                    isRequired={true}
                    helperText={'2-6 Zeichen, keine Sonderzeichen'}
                />
            )}
            {parameter === 'supplier' && (
                <CustomTextField
                    label="Link"
                    value={valueTwo}
                    setValue={setValueTwo}
                    isError={isValueTwoError}
                />
            )}
            {parameter === 'printer' && (
                <CustomTextField
                    label="IP-Adresse"
                    value={valueTwo}
                    setValue={setValueTwo}
                    isError={isValueTwoError}
                    isRequired={true}
                    isDisabled={!isAdmin && !isSuperAdmin}
                />
            )}
            {addSuccessfulAlert && (
                <CustomAlert
                    state="success"
                    message="Parameter erfolgreich angelegt!"
                />
            )}
            {isInputEmptyAlert && (
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
            <CustomButton
                onClick={onButtonClick}
                label="Anlegen"
                symbol={<Add />}
            />
            <Box my={1.5} />
            <CustomHeading2 text="Bestehende Parameter" />
            <Box my={1} />
            {renderTable(parameter)}
        </>
    );
}
