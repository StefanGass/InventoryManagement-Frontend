import { FC } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import CustomButton from 'components/form-fields/CustomButton';
import { Add, ArrowForward, Repeat } from '@mui/icons-material';
import { IDetailInventoryItem, IPrinter } from 'components/interfaces';
import PrintingForm from 'components/forms/inventory-form/PrintingForm';
import CustomDivider from 'components/layout/CustomDivider';
import { useRouter } from 'next/router';
import QrCode from 'components/layout/QrCode';

interface IAskAgainFormGroupProps {
    inventoryItem: IDetailInventoryItem;
    refreshInternalNumber: () => void;
    setAskAgain: (bool: boolean) => void;
    setReloadDepartment: (bool: boolean) => void;
    setDefaultForm: () => void;
    printer: IPrinter[];
}

const AskAgainFormGroup: FC<IAskAgainFormGroupProps> = (props) => {
    const { inventoryItem, refreshInternalNumber, setAskAgain, setReloadDepartment, setDefaultForm, printer } = props;
    const router = useRouter();

    return (
        <Box sx={{ display: 'flex', flexFlow: 'column wrap', width: '100%', alignItems: 'center' }}>
            <Box sx={{ my: 0.5 }} />
            <Typography>Folgender Gegenstand wurde dem Inventar hinzugefügt:</Typography>
            <Box sx={{ my: 0.5 }} />
            <Grid
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '10px'
                }}
            >
                {inventoryItem.itemInternalNumber && (
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
                        marginLeft: '20px'
                    }}
                >
                    {inventoryItem.itemInternalNumber}
                </Typography>
            </Grid>
            <Box sx={{ my: 1.5 }} />
            <CustomButton
                label={'Zu der Detailseite von ' + inventoryItem.itemInternalNumber}
                onClick={() => {
                    router.push(`/details/${inventoryItem.id}`);
                }}
                symbol={<ArrowForward />}
            />
            <CustomDivider />
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <CustomButton
                    label="Inventargegenstand erneut anlegen"
                    onClick={() => {
                        refreshInternalNumber();
                        setAskAgain(false);
                    }}
                    symbol={<Repeat />}
                />
                <CustomButton
                    label="Neuen Gegenstand anlegen"
                    onClick={() => {
                        setDefaultForm();
                        setReloadDepartment(true);
                        setAskAgain(false);
                    }}
                    symbol={<Add />}
                />
            </Grid>
            <CustomDivider />
            {inventoryItem.id && (
                <PrintingForm
                    inventoryId={inventoryItem.id}
                    printerList={printer}
                    showHeadline={true}
                />
            )}
        </Box>
    );
};

export default AskAgainFormGroup;
