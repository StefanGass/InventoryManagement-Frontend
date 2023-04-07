import { FC, useEffect, useRef, useState } from "react";
import { Button, Grid, Paper, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import CustomButton from 'components/form-fields/CustomButton';
import { Close, PhotoCamera, QrCode, Search } from '@mui/icons-material';
import jsQR from 'jsqr';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/router';
import { useDebounce } from 'utils/useDebounce';
import { ISearchForm } from 'components/interfaces';

const QrScanningForm: FC<ISearchForm> = (props) => {
    const {
        setSearch,
        items
    } = props

    const router = useRouter();
    const [value, setValue] = useState('');
    const [error, setError] = useState(false);

    // QR scan
    const [scan, setScan] = useState(false);
    const [scanError, setScanError] = useState(false);
    const [placeholderIcon, setPlaceholderIcon] = useState(true);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const qrVideo = useRef<HTMLVideoElement>(null);
    const debouncedSearchTerm = useDebounce(value, 500);
    useEffect(() => {
        setError(false);
    }, [value]);

    useEffect(
        () => {
            if (value.length > 1)
                setSearch(value);
            else if (value.length == 0)
                setSearch("");
        },
        [debouncedSearchTerm]
    );
    const handleError = (error: any) => {
        console.log(error);
        setError(true);
    };

    const startSearchClick = (codeData: string | null) => {
        if(items.length == 1){
            router.push('/details/' + items[0].id);
        }else if(codeData){
            fetch(
                codeData
                    ? `${process.env.HOSTNAME}/api/inventorymanagement/inventory/search/${codeData}`
                    : `${process.env.HOSTNAME}/api/inventorymanagement/inventory/search/${value}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }
            )
                .then((response) => {
                    if (response.ok) {
                        response
                            .json()
                            .then((result) => {
                                router.push('/details/' + result);
                            })
                            .catch((error) => {
                                handleError(error);
                            });
                    } else {
                        handleError(response);
                    }
                })
                .catch((error) => {
                    handleError(error);
                });
        }

    };

    const checkCameraStream = () => {
        try {
            if (qrVideo?.current?.readyState === qrVideo?.current?.HAVE_ENOUGH_DATA) {
                if (canvasRef != null && canvasRef.current != null) {
                    const canvas = canvasRef?.current?.getContext('2d');
                    if (qrVideo?.current?.videoHeight != null || qrVideo?.current?.videoWidth != null) {
                        canvasRef.current.height = qrVideo?.current?.videoHeight;
                        canvasRef.current.width = qrVideo?.current?.videoWidth;
                        if (canvas && qrVideo?.current) {
                            canvas.drawImage(qrVideo?.current, 0, 0, canvasRef.current.width, canvasRef.current?.height);
                            const imageData = canvas.getImageData(0, 0, canvasRef?.current?.width, canvasRef?.current?.height);
                            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                                inversionAttempts: 'attemptBoth'
                            });
                            if (code && code.data != '') {
                                setValue(code.data);
                                qrVideo.current.pause();
                                qrVideo.current.currentTime = 0;
                                setScan(false);
                                startSearchClick(code.data);
                            }
                        }
                    }
                }
            }
            requestAnimationFrame(checkCameraStream);
        } catch (error) {
            console.log(error);
            setScan(false);
            setPlaceholderIcon(true);
            setScanError(true);
        }
    };
    const startCamera = (props: boolean) => {
        setScanError(false);
        setValue('');
        if (navigator?.mediaDevices) {
            if (qrVideo?.current) {
                navigator.mediaDevices
                    .getUserMedia({ video: { facingMode: 'environment' } })
                    .then(function (stream) {
                        if (qrVideo.current !== null) {
                            setPlaceholderIcon(false);
                            qrVideo.current.srcObject = stream;
                            qrVideo.current.setAttribute('playsinline', 'playsinline'); // required to tell iOS safari we don't want fullscreen
                            if (props) {
                                qrVideo.current.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'center',
                                    inline: 'nearest'
                                });
                                qrVideo.current.play();
                                requestAnimationFrame(checkCameraStream);
                            } else {
                                qrVideo.current.pause();
                                qrVideo.current.currentTime = 0;
                            }
                        } else {
                            console.log('Video stream is null.');
                            setScan(false);
                            setPlaceholderIcon(true);
                            setScanError(true);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        setScan(false);
                        setPlaceholderIcon(true);
                        setScanError(true);
                    });
            }
        } else {
            console.log('No camera device found.');
            setScan(false);
            setPlaceholderIcon(true);
            setScanError(true);
        }
    };

    const startScanClick = () => {
        startCamera(true);
        setScan(true);
    };

    const closeScanClick = () => {
        startCamera(false);
        setScan(false);
        setPlaceholderIcon(true);
    };

    return (
        <>
            <Grid hidden={!scan}>
                <Grid
                    container
                    justifyContent="center"
                >
                    <Paper
                        elevation={6}
                        style={{
                            padding: '15px',
                            height: '270px',
                            width: '270px',
                            justifyContent: 'center'
                        }}
                    >
                        {placeholderIcon && (
                            <Box sx={{ m: 13.5 }}>
                                <PhotoCamera style={{ color: 'LightGray', transform: 'scale(6)' }} />
                            </Box>
                        )}
                        <video
                            ref={qrVideo}
                            width="240px"
                            height="240px"
                            style={{ objectFit: 'cover' }}
                        />
                    </Paper>
                </Grid>
                <Grid
                    container
                    justifyContent="center"
                >
                    <CustomButton
                        label="Scan abbrechen"
                        symbol={<Close />}
                        onClick={closeScanClick}
                    />
                </Grid>
            </Grid>
            {!scan && (
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                >
                    <Grid sx={{ flexGrow: 1, marginRight: '1em' }}>
                        <TextField
                            id="searchInput"
                            label={
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexWrap: 'wrap'
                                    }}
                                >
                                    <Search fontSize="small" />
                                    <span>&nbsp;Schnellsuche</span>
                                </div>
                            }
                            fullWidth={true}
                            size="small"
                            placeholder="Suchbegriff eingeben"
                            helperText={error && 'Inventarnummer wurde nicht gefunden.'}
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                            value={value}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    startSearchClick(null);
                                }
                            }}
                            onChange={(e) => setValue(e.target.value)}
                            error={error}
                        />
                    </Grid>
                    <Tooltip title={scanError ? 'Kamera nicht verfügbar.' : null}>
                        <div /* necessary to show tooltip */>
                            <Button
                                variant="contained"
                                onClick={startScanClick}
                                style={{
                                    height: '2.8em'
                                }}
                                disabled={scanError}
                            >
                                <QrCode />
                            </Button>
                        </div>
                    </Tooltip>
                </Grid>
            )}
            <canvas
                /* Necessary for reading QR code from scanner */
                id="canvas"
                hidden
                ref={canvasRef}
            />
        </>
    );
};

export default QrScanningForm;
