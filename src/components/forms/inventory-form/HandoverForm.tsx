import { FC, MouseEvent, useContext, useRef, useState } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import CustomButton from 'components/form-fields/CustomButton';
import { UserContext } from 'pages/_app';
import { Cancel, CheckCircle, Handshake } from '@mui/icons-material';
import SignaturePad from 'signature_pad';
import { mainBlack } from 'styles/theme';
import { IInventoryItem } from 'components/interfaces';
import CustomAlert from 'components/form-fields/CustomAlert';

interface IHandoverFormProps {
    inventoryItem: IInventoryItem;
    setLoading: (bool: boolean) => void;
    setUpdated: (bool: boolean) => void;
}

const HandoverForm: FC<IHandoverFormProps> = (props) => {
    const { firstName, lastName } = useContext(UserContext);
    const { inventoryItem, setLoading, setUpdated } = props;
    const [showSignaturePad, setShowSignaturePad] = useState(false);
    const [inputEmptyAlert, setInputEmptyAlert] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [signatureData, setSignatureData] = useState('');

    const onStartButtonClick = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setInputEmptyAlert(false);
        if (showSignaturePad) {
            setShowSignaturePad(false);
        } else {
            await setShowSignaturePad(true);
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
                        setInputEmptyAlert(false);
                    },
                    { once: false }
                );
            }
        }
    };

    const patchRequest = () => {
        fetch(`${process.env.HOSTNAME}/api/inventorymanagement/inventory/transferprotocol/${inventoryItem.id}/from/${firstName}/${lastName}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pictureUrl: signatureData })
        }).then((response) => {
            if (response.ok) {
                setUpdated(true);
            } else {
                // TODO error alert??
                console.log(response);
            }
        });
    };

    const onSendButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setLoading(true);
        if (signatureData) {
            patchRequest();
            setSignatureData('');
            setShowSignaturePad(false);
        } else {
            setInputEmptyAlert(true);
        }
        setLoading(false);
    };

    return (
        <Container maxWidth={'md'}>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <CustomButton
                    onClick={onStartButtonClick}
                    label={showSignaturePad ? 'Übergabeprotokoll abbrechen' : 'Übergabeprotokoll erstellen'}
                    symbol={showSignaturePad ? <Cancel /> : <Handshake />}
                    disabled={!inventoryItem.issuedTo}
                />
            </Grid>
            {showSignaturePad && (
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
                        {inputEmptyAlert && (
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
};

export default HandoverForm;
