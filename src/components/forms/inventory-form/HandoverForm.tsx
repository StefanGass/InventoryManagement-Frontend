import { MouseEvent, useContext, useEffect, useRef, useState } from 'react';
import { Box, Grid, IconButton, Tooltip, Typography, useMediaQuery } from '@mui/material';
import CustomButton from 'components/form-fields/CustomButton';
import { UserContext } from '../../../../pages/_app';
import { Cancel, CheckCircle, Handshake, RestartAlt } from '@mui/icons-material';
import SignaturePad from 'signature_pad';
import defaultTheme, { darkGrey, errorRed, mainGrey } from 'styles/theme';
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

    const signaturePadCanvasRef = useRef<HTMLCanvasElement>(null);
    const resetButtonRef = useRef<HTMLButtonElement>(null);
    const [signatureData, setSignatureData] = useState('');

    const matchesPhone = useMediaQuery(defaultTheme.breakpoints.down('xs'));
    const isLandscape = useMediaQuery('(orientation: landscape)');

    async function onStartButtonClick(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setIsInputEmptyAlert(false);
        if (isShowSignaturePad) {
            setIsShowSignaturePad(false);
            setIsInputEmptyAlert(false);
            setSignatureData('');
        } else {
            await setIsShowSignaturePad(true); // the await MUST not be removed
            if (signaturePadCanvasRef != null && signaturePadCanvasRef.current != null && resetButtonRef != null && resetButtonRef.current != null) {
                const canvas = signaturePadCanvasRef.current;
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
                resetButtonRef.current.addEventListener('click', () => {
                    setSignatureData('');
                    signaturePad.clear();
                });
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

    useEffect(() => {
        setIsShowSignaturePad(false);
        setIsInputEmptyAlert(false);
        setSignatureData('');
    }, [matchesPhone, isLandscape]);

    return (
        <>
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
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        maxWidth="md"
                    >
                        <Grid
                            container
                            justifyContent="space-between"
                            direction="row"
                            alignItems="end"
                            width={matchesPhone && !isLandscape ? 300 : 450}
                            marginBottom="-15px"
                            marginTop="5px"
                        >
                            <Typography
                                variant="caption"
                                color={darkGrey}
                            >
                                Hier unterschreiben: *
                            </Typography>
                            <IconButton
                                ref={resetButtonRef}
                                sx={{ width: '20px', height: '20px', marginBottom: '2px', marginRight: '-7px' }}
                            >
                                <RestartAlt fontSize="small" />
                            </IconButton>
                        </Grid>
                        <Grid
                            sx={{
                                marginTop: '1em',
                                marginBottom: '1em',
                                border: `1px solid ${isInputEmptyAlert ? errorRed : mainGrey}`,
                                borderRadius: '5px',
                                background: '#ffffff',
                                '&:hover': {
                                    borderColor: isInputEmptyAlert ? errorRed : mainGrey,
                                    cursor: 'pointer'
                                }
                            }}
                        >
                            <canvas
                                id="canvas"
                                ref={signaturePadCanvasRef}
                                width={matchesPhone && !isLandscape ? 300 : 450}
                                height={matchesPhone && !isLandscape ? 150 : 200}
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
        </>
    );
}
