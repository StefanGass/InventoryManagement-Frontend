import { MouseEvent, useContext, useRef, useState } from 'react';
import { Box, Container, Grid, Tooltip, Typography } from '@mui/material';
import CustomButton from 'components/form-fields/CustomButton';
import { UserContext } from '../../../../pages/_app';
import { Cancel, CheckCircle, Handshake } from '@mui/icons-material';
import SignaturePad from 'signature_pad';
import { mainBlack } from 'styles/theme';
import { IInventoryItem } from 'components/interfaces';
import CustomAlert from 'components/form-fields/CustomAlert';

interface IHandoverFormProps {
    inventoryItem: IInventoryItem;
    setIsUpdated: (bool: boolean) => void;
    setIsLoading: (bool: boolean) => void;
    setServerError: (val: string) => void;
}

export default function HandoverForm(props: IHandoverFormProps) {
    const { firstName, lastName } = useContext(UserContext);
    const { inventoryItem, setIsUpdated, setIsLoading, setServerError } = props;
    const [isShowSignaturePad, setIsShowSignaturePad] = useState(false);
    const [isInputEmptyAlert, setIsInputEmptyAlert] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [signatureData, setSignatureData] = useState('');

    async function onStartButtonClick(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setIsInputEmptyAlert(false);
        if (isShowSignaturePad) {
            setIsShowSignaturePad(false);
        } else {
            await setIsShowSignaturePad(true); // the await MUST not be removed
            if (canvasRef != null && canvasRef.current != null) {
                const canvas = canvasRef.current;
                const signaturePad = new SignaturePad(canvas, {
                    dotSize: 2,
                    minWidth: 1,
                    maxWidth: 2,
                    backgroundColor: '#ffffff'
                });
                signaturePad.clear();
                signaturePad.addEventListener(
                    'afterUpdateStroke',
                    () => {
                        setSignatureData(signaturePad.toDataURL());
                        setIsInputEmptyAlert(false);
                    },
                    { once: false }
                );
            }
        }
    }

    function patchRequest() {
        fetch(`${process.env.HOSTNAME}/api/inventorymanagement/inventory/transferprotocol/${inventoryItem.id}/from/${firstName}/${lastName}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pictureUrl: signatureData })
        })
            .then((response) => {
                if (response.ok) {
                    setIsUpdated(true);
                } else {
                    setServerError(response.statusText);
                }
            })
            .catch((e) => setServerError(e.message));
    }

    function onSendButtonClick(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setIsLoading(true);
        if (signatureData) {
            patchRequest();
            setSignatureData('');
            setIsShowSignaturePad(false);
        } else {
            setIsInputEmptyAlert(true);
        }
        setIsLoading(false);
    }

    return (
        <Container maxWidth="md">
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Tooltip
                    title={
                        !inventoryItem.issuedTo
                            ? 'Ein Rückgabeprotokoll kann nur erstellt werden, wenn der Gegenstand an jemanden ausgegeben wurde.'
                            : undefined
                    }
                    followCursor={true}
                    enterDelay={500}
                >
                    <Box /* necessary for showing tooltip */>
                        <CustomButton
                            onClick={onStartButtonClick}
                            label={isShowSignaturePad ? 'Übergabeprotokoll abbrechen' : 'Übergabeprotokoll erstellen'}
                            symbol={isShowSignaturePad ? <Cancel /> : <Handshake />}
                            isDisabled={!inventoryItem.issuedTo}
                        />
                    </Box>
                </Tooltip>
            </Grid>
            {isShowSignaturePad && (
                <>
                    <Typography
                        align="center"
                        marginTop="5px"
                    >
                        Übergabe an: <strong>{inventoryItem.issuedTo}</strong>
                    </Typography>
                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Grid
                            sx={{
                                marginTop: '1em',
                                marginBottom: '1em',
                                border: `1px solid ${mainBlack}`,
                                borderRadius: '5px',
                                background: '#ffffff'
                            }}
                        >
                            <canvas
                                id="canvas"
                                ref={canvasRef}
                                style={{ marginTop: '2px', marginLeft: '2px', marginRight: '2px', marginBottom: '-5px' }}
                            />
                        </Grid>
                        {isInputEmptyAlert && (
                            <CustomAlert
                                state="error"
                                message="Bitte Unterschrift ergänzen!"
                            />
                        )}
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <CustomButton
                                onClick={onSendButtonClick}
                                label="Absenden"
                                symbol={<CheckCircle />}
                            />
                        </Grid>
                    </Grid>
                </>
            )}
        </Container>
    );
}
