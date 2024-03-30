import { Box, Container, Grid } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { ICategory, IDepartment, ILocation, ISupplier, IType } from 'components/interfaces';
import CustomAutocomplete from 'components/form-fields/CustomAutocomplete';
import { defaultInventory, inventoryFormRequiredSchema } from 'components/forms/inventory-form/inventoryFormDefaultValues';
import CustomDatePicker from 'components/form-fields/CustomDatePicker';
import { format, formatISO } from 'date-fns';
import CustomButton from 'components/form-fields/CustomButton';
import { UserContext } from '../../../pages/_app';
import ExportSelectionInformation from 'components/layout/ExportSelectionInformation';
import CustomSelectStatus from 'components/form-fields/CustomSelectStatus';
import CommonConstants from 'constants/InventoryItemStatusConstants';
import InventoryItemStatusConstants from 'constants/InventoryItemStatusConstants';
import { Download } from '@mui/icons-material';
import CustomHeading2 from 'components/layout/CustomHeading2';

interface IExportFormTable {
    department?: IDepartment;
    category?: ICategory;
    type?: IType;
    supplier?: ISupplier;
    status?: string;
    location?: ILocation;
    creationDateFrom: string;
    creationDateTo: string;
    deliveryDateFrom: string;
    deliveryDateTo: string;
    issueDateFrom: string;
    issueDateTo: string;
    droppingDateFrom: string;
    droppingDateTo: string;
}

interface ExportFormProps {
    department: IDepartment[];
    category: ICategory[];
    type: IType[];
    supplier: ISupplier[];
    location: ILocation[];
    setIsLoading: (val: boolean) => void;
    setIsServerError: (val: boolean) => void;
}

export default function ExportForm(props: ExportFormProps) {
    const [formValidation] = useState(JSON.parse(JSON.stringify(inventoryFormRequiredSchema)));
    const { userId, isAdmin, isSuperAdmin } = useContext(UserContext);
    const { department, category, type, supplier, location, setIsLoading, setIsServerError } = props;
    const [exportForm, setExportForm] = useState<IExportFormTable>(JSON.parse(JSON.stringify(defaultInventory)));

    function convertToDateToEndOfTheDay(originalDate: string) {
        const tmpToDate = new Date(originalDate);
        return formatISO(tmpToDate, { representation: 'date' }) + 'T23:59:59Z';
    }

    function handleExport() {
        setIsLoading(true);
        const {
            department,
            category,
            type,
            creationDateTo,
            creationDateFrom,
            issueDateTo,
            issueDateFrom,
            droppingDateTo,
            droppingDateFrom,
            deliveryDateTo,
            deliveryDateFrom,
            location,
            status,
            supplier
        } = exportForm;

        let queryParams = '';

        if (department) {
            queryParams += `departmentId=${department.id}&`;
        }
        if (category) {
            queryParams += `categoryId=${category.id}&`;
        }
        if (type) {
            queryParams += `typeId=${type.id}&`;
        }
        if (location) {
            queryParams += `locationId=${location.id}&`;
        }
        if (supplier) {
            queryParams += `supplierId=${supplier.id}&`;
        }
        if (status) {
            queryParams += `status=${status}&`;
        }
        if (creationDateFrom) {
            queryParams += `creationDateFrom=${creationDateFrom}&`;
        }
        if (creationDateTo) {
            queryParams += `creationDateTo=${convertToDateToEndOfTheDay(creationDateTo)}&`;
        }
        if (issueDateFrom) {
            queryParams += `issueDateFrom=${issueDateFrom}&`;
        }
        if (issueDateTo) {
            queryParams += `issueDateTo=${convertToDateToEndOfTheDay(issueDateTo)}&`;
        }
        if (droppingDateFrom) {
            queryParams += `droppingDateFrom=${droppingDateFrom}&`;
        }
        if (droppingDateTo) {
            queryParams += `droppingDateTo=${convertToDateToEndOfTheDay(droppingDateTo)}&`;
        }
        if (deliveryDateFrom) {
            queryParams += `deliveryDateFrom=${deliveryDateFrom}&`;
        }
        if (deliveryDateTo) {
            queryParams += `deliveryDateTo=${convertToDateToEndOfTheDay(deliveryDateTo)}&`;
        }

        fetch(`${process.env.HOSTNAME}/api/inventorymanagement/inventory/export?${queryParams}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
            if (res.ok) {
                res.blob()
                    .then((res) => {
                        const url = window.URL.createObjectURL(res);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'Inventar_' + format(new Date(), 'dd-MM-yyyy_HH-mm-ss') + '.xlsx';
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        setIsLoading(false);
                    })
                    .catch(() => {
                        setIsLoading(false);
                        setIsServerError(true);
                    });
            }
        });
    }

    useEffect(() => {
        fetch(`${process.env.HOSTNAME}/api/inventorymanagement/department/user/${userId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((response) => {
                if (response.ok) {
                    response
                        .json()
                        .then((result) => {
                            setExportForm({ ...exportForm, department: result });
                        })
                        .catch(() => {
                            setIsServerError(true);
                        });
                }
            })
            .catch(() => {
                setIsServerError(true);
            });
    }, []);

    // prevent that both category and type get picked
    useEffect(() => {
        if (exportForm.category) {
            setExportForm({ ...exportForm, type: undefined } as IExportFormTable);
        } else {
            setExportForm({ ...exportForm, category: undefined } as IExportFormTable);
        }
    }, [exportForm.category, exportForm.type]);

    useEffect(() => {
        setExportForm({
            ...exportForm,
            issueDateFrom: '',
            issueDateTo: '',
            droppingDateFrom: '',
            droppingDateTo: ''
        } as IExportFormTable);
    }, [exportForm.status]);

    return (
        <>
            <Box my={0.5} />
            <CustomHeading2 text="Filter setzen (nur bei Bedarf)" />
            <Box my={0.5} />
            {(isAdmin || isSuperAdmin) && department && exportForm && (
                <CustomAutocomplete
                    options={department}
                    optionKey="departmentName"
                    label="Abteilung"
                    value={exportForm.department?.departmentName ?? ''}
                    setValue={(val) => {
                        setExportForm({ ...exportForm, department: val } as IExportFormTable);
                    }}
                    isError={formValidation.find((field) => field.name === 'department')?.error ?? false}
                />
            )}
            <Grid
                container
                alignItems="center"
                justifyContent="center"
                marginTop={0.5}
            >
                <ExportSelectionInformation label="Kategorie ODER Typ auswählen" />
                {category && exportForm && (
                    <CustomAutocomplete
                        options={category}
                        optionKey="categoryName"
                        label="Kategorie"
                        value={exportForm.category?.categoryName ?? ''}
                        setValue={(val) => {
                            setExportForm({ ...exportForm, category: val } as IExportFormTable);
                        }}
                        isError={formValidation.find((field) => field.name === 'category')?.error ?? false}
                        isDisabled={exportForm.type != undefined}
                    />
                )}
                {type && exportForm && (
                    <CustomAutocomplete
                        options={type}
                        optionKey="typeName"
                        label="Typ"
                        value={exportForm.type?.typeName ?? ''}
                        setValue={(val) => {
                            setExportForm({ ...exportForm, type: val } as IExportFormTable);
                        }}
                        isError={formValidation.find((field) => field.name === 'type')?.error ?? false}
                        isDisabled={exportForm.category != undefined}
                    />
                )}
            </Grid>
            <Grid
                container
                alignItems="center"
                justifyContent="center"
                marginTop={0.5}
            >
                {location && exportForm && (
                    <CustomAutocomplete
                        options={location}
                        optionKey="locationName"
                        label="Standort"
                        value={exportForm.location?.locationName ?? ''}
                        setValue={(val) => {
                            setExportForm({ ...exportForm, location: val } as IExportFormTable);
                        }}
                        isError={formValidation.find((field) => field.name === 'location')?.error ?? false}
                    />
                )}
            </Grid>
            {supplier && exportForm && (
                <CustomAutocomplete
                    options={supplier}
                    optionKey="supplierName"
                    label="Lieferant"
                    value={exportForm.supplier?.supplierName ?? ''}
                    setValue={(val) => {
                        setExportForm({ ...exportForm, supplier: val } as IExportFormTable);
                    }}
                    isError={formValidation.find((field) => field.name === 'supplier')?.error ?? false}
                />
            )}
            <CustomSelectStatus
                label="Status"
                menuItemList={Object.values(CommonConstants)}
                value={exportForm.status ?? ''}
                setValue={(val) => {
                    setExportForm({ ...exportForm, status: val } as IExportFormTable);
                }}
            />
            <ExportSelectionInformation label="Betrifft alle Datumsfelder: Für den gesamten Zeitraum ein oder beide Felder frei lassen" />
            {(exportForm.status?.toUpperCase() === InventoryItemStatusConstants.AUSGEGEBEN ||
                exportForm.status?.toUpperCase() === InventoryItemStatusConstants.VERTEILT) && (
                <Grid
                    container
                    alignItems="center"
                    justifyContent="center"
                    marginTop={0.5}
                >
                    <CustomDatePicker
                        label="Ausgabedatum von"
                        value={exportForm.issueDateFrom}
                        setValue={(val) => {
                            setExportForm({ ...exportForm, issueDateFrom: val } as IExportFormTable);
                        }}
                        isDisableFuture={true}
                        isDisplayWeekNumber={true}
                        maxDate={exportForm.issueDateTo}
                    />
                    <CustomDatePicker
                        label="Ausgabedatum bis"
                        value={exportForm.issueDateTo}
                        setValue={(val) => {
                            setExportForm({ ...exportForm, issueDateTo: val } as IExportFormTable);
                        }}
                        isDisableFuture={true}
                        isDisplayWeekNumber={true}
                        minDate={exportForm.issueDateFrom}
                    />
                </Grid>
            )}
            {(exportForm.status?.toUpperCase() === InventoryItemStatusConstants.AUSGESCHIEDEN ||
                exportForm.status?.toUpperCase() === InventoryItemStatusConstants.VERTEILT) && (
                <Grid
                    container
                    alignItems="center"
                    justifyContent="center"
                    marginTop={0.5}
                >
                    <CustomDatePicker
                        label="Ausscheidedatum von"
                        value={exportForm.droppingDateFrom}
                        setValue={(val) => {
                            setExportForm({ ...exportForm, droppingDateFrom: val } as IExportFormTable);
                        }}
                        isDisableFuture={true}
                        isDisplayWeekNumber={true}
                        maxDate={exportForm.droppingDateTo}
                    />
                    <CustomDatePicker
                        label="Ausscheidedatum bis"
                        value={exportForm.droppingDateTo}
                        setValue={(val) => {
                            setExportForm({ ...exportForm, droppingDateTo: val } as IExportFormTable);
                        }}
                        isDisableFuture={true}
                        isDisplayWeekNumber={true}
                        minDate={exportForm.droppingDateFrom}
                    />
                </Grid>
            )}
            <Grid
                container
                alignItems="center"
                justifyContent="center"
                marginTop={0.5}
            >
                <CustomDatePicker
                    label="Anlagedatum von"
                    value={exportForm.creationDateFrom}
                    setValue={(val) => {
                        setExportForm({ ...exportForm, creationDateFrom: val } as IExportFormTable);
                    }}
                    isDisableFuture={true}
                    isDisplayWeekNumber={true}
                    maxDate={exportForm.creationDateTo}
                />
                <CustomDatePicker
                    label="Anlagedatum bis"
                    value={exportForm.creationDateTo}
                    setValue={(val) => {
                        setExportForm({ ...exportForm, creationDateTo: val } as IExportFormTable);
                    }}
                    isDisableFuture={true}
                    isDisplayWeekNumber={true}
                    minDate={exportForm.creationDateFrom}
                />
            </Grid>
            <Container maxWidth="sm">
                <ExportSelectionInformation label="Das Feld 'Lieferdatum' ist im Inventargegenstand kein Pflichtfeld - wenn es als Filter gesetzt wird, dort aber beim jeweiligen Gegenstand nichts hinterlegt ist, wird er aus der Auswertung exkludiert." />
            </Container>
            <Grid
                container
                alignItems="center"
                justifyContent="center"
                marginTop={0.5}
            >
                <CustomDatePicker
                    label="Lieferdatum von"
                    value={exportForm.deliveryDateFrom}
                    setValue={(val) => {
                        setExportForm({ ...exportForm, deliveryDateFrom: val } as IExportFormTable);
                    }}
                    isDisableFuture={true}
                    isDisplayWeekNumber={true}
                    maxDate={exportForm.deliveryDateTo}
                />
                <CustomDatePicker
                    label="Lieferdatum bis"
                    value={exportForm.deliveryDateTo}
                    setValue={(val) => {
                        setExportForm({ ...exportForm, deliveryDateTo: val } as IExportFormTable);
                    }}
                    isDisableFuture={true}
                    isDisplayWeekNumber={true}
                    minDate={exportForm.deliveryDateFrom}
                />
            </Grid>
            <Box my={1.5} />
            <CustomHeading2 text="Download starten" />
            <CustomButton
                onClick={handleExport}
                symbol={<Download />}
                label="Download"
            />
        </>
    );
}
