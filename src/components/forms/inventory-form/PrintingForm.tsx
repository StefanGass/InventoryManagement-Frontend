import { MouseEvent, useContext, useEffect, useState } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import CustomTextField from 'components/form-fields/CustomTextField';
import { GenericObject, IPrinter } from 'components/interfaces';
import CustomAutocomplete from 'components/form-fields/CustomAutocomplete';
import CustomButton from 'components/form-fields/CustomButton';
import { Print } from '@mui/icons-material';
import { UserContext } from '../../../../pages/_app';
import CustomAlert from 'components/form-fields/CustomAlert';

interface IPrintingFormProps {
    inventoryId: number;
    printerList: IPrinter[];
    showHeadline: boolean;
}

export default function PrintingForm(props: IPrintingFormProps) {
    const { inventoryId, printerList, showHeadline } = props;

    const { userId } = useContext(UserContext);

    const [printer, setPrinter] = useState<string | GenericObject | null>(printerList[0]);
    const [isPrinterError, setIsPrinterError] = useState(false);
    const [piecesToPrint, setPiecesToPrint] = useState(1);
    const [isPiecesToPrintError, setIsPiecesToPrintError] = useState(false);

    const [isPrintSuccessful, setIsPrintSuccessful] = useState(false);
    const [isPrintingError, setIsPrintingError] = useState(false);

    useEffect(() => {
        setIsPrintSuccessful(false);
        printer && setIsPrinterError(false);
        piecesToPrint > 0 && setIsPiecesToPrintError(false);
    }, [printer, piecesToPrint]);

    async function onButtonClick(e: MouseEvent<HTMLButtonElement>) {
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
                        setIsPrintSuccessful(true);
                    } else {
                        setIsPrintingError(true);
                    }
                })
                .catch((error) => {
                    setIsPrintingError(true);
                    console.log(error);
                });
        } else {
            !printer && setIsPrinterError(true);
            piecesToPrint < 1 && setIsPiecesToPrintError(true);
        }
    }

    return (
        <Container maxWidth="md">
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
                    isRequired={true}
                    isError={isPrinterError}
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
                    isError={isPiecesToPrintError}
                    isRequired={true}
                    type="number"
                />
                {isPrintSuccessful && (
                    <CustomAlert
                        state="success"
                        message="Druck erfolgreich!"
                    />
                )}
                {isPrintingError && (
                    <CustomAlert
                        state="error"
                        message="Da lief etwas schief - bitte an die IT wenden!"
                    />
                )}
                {isPrinterError && (
                    <CustomAlert
                        state="error"
                        message="Drucker auswählen!"
                    />
                )}
                {isPiecesToPrintError && (
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
}
