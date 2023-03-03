import { FC, MouseEvent, useContext, useEffect, useState } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import CustomTextField from 'components/form-fields/CustomTextField';
import { GenericObject, IPrinter } from 'components/interfaces';
import CustomAutocomplete from 'components/form-fields/CustomAutocomplete';
import CustomButton from 'components/form-fields/CustomButton';
import { Print } from '@mui/icons-material';
import { UserContext } from 'pages/_app';
import CustomAlert from 'components/form-fields/CustomAlert';

interface IPrintingFormProps {
    inventoryId: number;
    printerList: IPrinter[];
    showHeadline: boolean;
}

const PrintingForm: FC<IPrintingFormProps> = (props) => {
    const { inventoryId, printerList, showHeadline } = props;

    const { userId } = useContext(UserContext);

    const [printer, setPrinter] = useState<string | GenericObject | null>(printerList[0]);
    const [printerError, setPrinterError] = useState(false);
    const [piecesToPrint, setPiecesToPrint] = useState(1);
    const [piecesToPrintError, setPiecesToPrintError] = useState(false);

    const [printSuccessful, setPrintSuccessful] = useState(false);
    const [printingError, setPrintingError] = useState(false);

    useEffect(() => {
        setPrintSuccessful(false);
        printer && setPrinterError(false);
        piecesToPrint > 0 && setPiecesToPrintError(false);
    }, [printer, piecesToPrint]);

    const onButtonClick = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (printer && piecesToPrint > 0) {
            let tempPrinter = printer as IPrinter;
            await fetch(
                `${process.env.HOSTNAME}/api/inventorymanagement/printer/${tempPrinter.id}/print/${inventoryId}/pieces/${piecesToPrint}/user/${userId}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }
            )
                .then((response) => {
                    if (response.ok) {
                        setPrintSuccessful(true);
                    } else {
                        setPrintingError(true);
                    }
                })
                .catch((error) => {
                    setPrintingError(true);
                    console.log(error);
                });
        } else {
            !printer && setPrinterError(true);
            piecesToPrint < 1 && setPiecesToPrintError(true);
        }
    };

    return (
        <Container maxWidth={'md'}>
            {showHeadline && (
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Typography
                        variant="h3"
                        align="center"
                        gutterBottom
                    >
                        Etiketten drucken
                    </Typography>
                </Grid>
            )}
            <Box sx={{ my: 2 }} />
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <CustomAutocomplete
                    options={printerList}
                    optionKey="printerName"
                    label="Drucker auswählen"
                    value={printer?.['printerName'] ?? ''}
                    setValue={setPrinter}
                    required={true}
                    error={printerError}
                />
                <CustomTextField
                    label="Stückzahl Etiketten"
                    value={piecesToPrint}
                    setValue={(val) => {
                        if (Number(val) < 1) {
                            setPiecesToPrint(1);
                        } else {
                            setPiecesToPrint(Number(val));
                        }
                    }}
                    error={piecesToPrintError}
                    required={true}
                    type="number"
                />
                {printSuccessful && (
                    <CustomAlert
                        state="success"
                        message="Druck erfolgreich!"
                    />
                )}
                {printingError && (
                    <CustomAlert
                        state="error"
                        message="Da lief etwas schief - bitte an die IT wenden!"
                    />
                )}
                {printerError && (
                    <CustomAlert
                        state="error"
                        message="Drucker auswählen!"
                    />
                )}
                {piecesToPrintError && (
                    <CustomAlert
                        state="error"
                        message="Mehr als 0 Stück auswählen!"
                    />
                )}
                <CustomButton
                    onClick={onButtonClick}
                    label="Etiketten drucken"
                    symbol={<Print />}
                />
            </Grid>
        </Container>
    );
};

export default PrintingForm;
