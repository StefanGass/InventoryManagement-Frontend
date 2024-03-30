import { useEffect, useRef, useState } from 'react';
import { Box, Button, Grid, Paper, Tooltip } from '@mui/material';
import CustomButton from 'components/form-fields/CustomButton';
import { Close, PhotoCamera, QrCode, Search } from '@mui/icons-material';
import jsQR from 'jsqr';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/router';
import { useDebounce } from 'hooks/useDebounce';
import { ISearchForm } from 'components/interfaces';

export default function QrScanningForm(props: ISearchForm) {
    const { setSearch, items } = props;

    const router = useRouter();
    const [value, setValue] = useState('');
    const [isServerError, setIsServerError] = useState(false);

    // QR scan
    const [isScanActive, setIsScanActive] = useState(false);
    const [isScanError, setIsScanError] = useState(false);
    const [isShowPlaceholderIcon, setIsShowPlaceholderIcon] = useState(true);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const qrVideo = useRef<HTMLVideoElement>(null);
    const debouncedSearchTerm = useDebounce(value, 500);

    useEffect(() => {
        setIsServerError(false);
    }, [value]);

    useEffect(() => {
        if (value.length > 1) setSearch(value);
        else if (value.length == 0) setSearch('');
    }, [debouncedSearchTerm]);

    function handleError(error: any) {
        console.log(error);
        setIsServerError(true);
    }

    function startSearchClick(codeData: string | null) {
        if (items.length == 1) {
            router.push('/details/' + items[0].id);
        } else if (codeData) {
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
    }

    function checkCameraStream() {
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
                                setIsScanActive(false);
                                startSearchClick(code.data);
                            }
                        }
                    }
                }
            }
            requestAnimationFrame(checkCameraStream);
        } catch (error) {
            console.log(error);
            setIsScanActive(false);
            setIsShowPlaceholderIcon(true);
            setIsScanError(true);
        }
    }

    function startCamera(props: boolean) {
        setIsScanError(false);
        setValue('');
        if (navigator?.mediaDevices) {
            if (qrVideo?.current) {
                navigator.mediaDevices
                    .getUserMedia({ video: { facingMode: 'environment' } })
                    .then(function (stream) {
                        if (qrVideo.current !== null) {
                            setIsShowPlaceholderIcon(false);
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
                            setIsScanActive(false);
                            setIsShowPlaceholderIcon(true);
                            setIsScanError(true);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        setIsScanActive(false);
                        setIsShowPlaceholderIcon(true);
                        setIsScanError(true);
                    });
            }
        } else {
            console.log('No camera device found.');
            setIsScanActive(false);
            setIsShowPlaceholderIcon(true);
            setIsScanError(true);
        }
    }

    function startScanClick() {
        startCamera(true);
        setIsScanActive(true);
    }

    function closeScanClick() {
        startCamera(false);
        setIsScanActive(false);
        setIsShowPlaceholderIcon(true);
    }

    return (
        <>
            {!isScanError && (
                <Grid hidden={!isScanActive}>
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
                            {isShowPlaceholderIcon && (
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
            )}
            {!isScanActive && (
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                >
                    <Grid sx={{ flexGrow: 1, marginRight: '1em' }}>
                        <TextField
                            label={
                                <Box
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexWrap: 'wrap'
                                    }}
                                >
                                    <Search
                                        fontSize="small"
                                        sx={{ marginRight: '7px' }}
                                    />
                                    <span>Schnellsuche</span>
                                </Box>
                            }
                            fullWidth={true}
                            size="small"
                            placeholder="Suchbegriff eingeben"
                            helperText={isServerError && 'Inventarnummer wurde nicht gefunden.'}
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                            value={value}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    startSearchClick(null);
                                }
                            }}
                            onChange={(e) => setValue(e.target.value)}
                            error={isServerError}
                        />
                    </Grid>
                    <Tooltip
                        title={isScanError ? 'Kamera nicht verfügbar.' : undefined}
                        enterDelay={500}
                        followCursor={true}
                    >
                        <Box style={{ cursor: `${isScanError ? 'not-allowed' : 'pointer'}` }} /* necessary to show tooltip */>
                            <Button
                                variant="contained"
                                onClick={startScanClick}
                                style={{
                                    height: '2.8em'
                                }}
                                disabled={isScanError}
                            >
                                <QrCode />
                            </Button>
                        </Box>
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
}
