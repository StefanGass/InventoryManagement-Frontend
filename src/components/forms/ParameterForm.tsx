import { GenericObject, ICategory, ILocation, IObjectToSend, ISupplier, IType } from 'components/interfaces';
import { FC, MouseEvent, useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import CustomTextField from 'components/form-fields/CustomTextField';
import CustomAutocomplete from 'components/form-fields/CustomAutocomplete';
import { Add } from '@mui/icons-material';
import DataTableType from 'components/tables/DataTableType';
import DataTableCategory from 'components/tables/DataTableCategory';
import DataTableLocation from 'components/tables/DataTableLocation';
import DataTableSupplier from 'components/tables/DataTableSupplier';
import CustomButton from 'components/form-fields/CustomButton';
import ParameterFormAlert from 'components/alerts/ParameterFormAlert';

interface IPropertyForm {
    parameter: number | null;
    tableList: ICategory[] | IType[] | ISupplier[] | ILocation[];
    categoryOptions: ICategory[];
    addSuccessfulAlert: boolean;
    duplicateErrorAlert: boolean;
    onClick: (e: MouseEvent<HTMLButtonElement>, objectToSend: IObjectToSend | null, tableToFetch: string) => void;
    setAddedSuccessfulAlert: (bool: boolean) => void;
    setDuplicateErrorAlert: (bool: boolean) => void;
}

const ParameterForm: FC<IPropertyForm> = (props) => {
    const { parameter, tableList, onClick, addSuccessfulAlert, duplicateErrorAlert, categoryOptions, setAddedSuccessfulAlert, setDuplicateErrorAlert } = props;

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
        setValueOneError(false);
    }, [valueOne]);

    useEffect(() => {
        setValueTwoError(false);
    }, [valueTwo]);

    if (!parameter) {
        return null;
    }

    const onButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        setInputEmptyAlert(false);
        setAddedSuccessfulAlert(false);
        setDuplicateErrorAlert(false);
        setValueOneError(false);
        setValueTwoError(false);
        if (valueOne && !(/^\s*$/.test(valueOne))) {
            const trimmedValueOne = valueOne.trim();
            let trimmedValueTwo = null;
            if (parameter === 4 && valueTwo) {
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
                    objectToSend = { categoryName: trimmedValueOne };
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
                default:
                    tableToFetch = '';
                    break;
            }
            if (parameter !== 1 || valueTwo) {
                onClick(e, objectToSend, tableToFetch);
                setValueOne('');
                setValueTwo('');
            } else {
                setInputEmptyAlert(true);
                setValueTwoError(true);
            }
        } else {
            setInputEmptyAlert(true);
            setValueOneError(true);
            if (parameter === 1 && !valueTwo) {
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
                {parameter === 4 && (
                    <CustomTextField
                        label="Link"
                        value={valueTwo}
                        setValue={setValueTwo}
                        error={valueTwoError}
                    />
                )}
                <ParameterFormAlert
                    addSuccessfulAlert={addSuccessfulAlert}
                    inputEmptyAlert={inputEmptyAlert}
                    duplicateErrorAlert={duplicateErrorAlert}
                />
                <Grid
                    container
                    justifyContent="center"
                >
                    <CustomButton
                        onClick={onButtonClick}
                        label="Anlegen"
                        symbol={<Add />}
                    />
                </Grid>
            </Grid>
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
