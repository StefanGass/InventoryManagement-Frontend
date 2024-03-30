import { Box, Grid, Typography } from '@mui/material';
import CustomButton from 'components/form-fields/CustomButton';
import { Add, ArrowForward, Repeat } from '@mui/icons-material';
import { IDetailInventoryItem, IPictureUpload, IPrinter } from 'components/interfaces';
import PrintingForm from 'components/forms/inventory-form/PrintingForm';
import CustomDivider from 'components/layout/CustomDivider';
import { useRouter } from 'next/router';
import QrCode from 'components/layout/QrCode';

interface IAskAgainFormGroupProps {
    inventoryItem: IDetailInventoryItem;
    setPictureList: (list: IPictureUpload[]) => void;
    refreshInternalNumber: () => void;
    setAskAgain: (bool: boolean) => void;
    setReloadDepartment: (bool: boolean) => void;
    setDefaultForm: () => void;
    printer: IPrinter[];
}

export default function AskAgainFormGroup(props: IAskAgainFormGroupProps) {
    const { inventoryItem, setPictureList, refreshInternalNumber, setAskAgain, setReloadDepartment, setDefaultForm, printer } = props;
    const router = useRouter();

    return (
        <Box
            display="flex"
            alignItems="center"
            width="100%"
            sx={{ flexFlow: 'column wrap' }}
        >
            <Box my={0.5} />
            <Typography>Folgender Gegenstand wurde dem Inventar hinzugefügt:</Typography>
            <Box my={0.5} />
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
            <Box my={0.5} />
            <CustomButton
                label="Zur Detailseite"
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
                    label="Gegenstand erneut anlegen"
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
                        setPictureList([]);
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
            <Box my={1} />
        </Box>
    );
}
