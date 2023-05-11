import { ChangeEvent, FC, useContext, useEffect, useRef, useState } from 'react';
import { Box, Button, Container, Grid, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { CameraAlt, Delete, PhotoCamera, UploadFile } from '@mui/icons-material';
import { IPicture, IPictureUpload } from 'components/interfaces';
import lightTheme, { darkGrey, lightGrey, mainBlack, mainWhite } from 'styles/theme';
import { UserContext } from 'pages/_app';
import { format } from 'date-fns';
import styles from 'styles/ImageUpload.module.scss';
import CustomButton from 'components/form-fields/CustomButton';

interface IImageUploadProps {
    setPictures: (pictures: IPicture[]) => void;
    disabled?: boolean;
}

const ImageUpload: FC<IImageUploadProps> = ({ setPictures, disabled }) => {
    const { themeMode } = useContext(UserContext);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cameraVideo = useRef<HTMLVideoElement>(null);
    const [pictureList, setPictureList] = useState<IPictureUpload[]>([]);
    const [noCameraAvailableError, setNoCameraAvailableError] = useState(false);
    const [isShowPlaceholderIcon, setIsShowPlaceholderIcon] = useState(true);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraSettings, setCameraSettings] = useState<MediaTrackSettings | null>(null);

    const matches = useMediaQuery(lightTheme.breakpoints.down('md'));

    const transformPictures = async (changeEvent: ChangeEvent<HTMLInputElement>) => {
        if (changeEvent.target.files) {
            const filePromises = Array.from(changeEvent.target.files).map((file) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                        if (reader.result !== null) {
                            resolve({ name: file.name, base64: reader.result });
                        } else {
                            reject();
                        }
                    };
                });
            });
            await Promise.all(filePromises).then((res) => {
                changeEvent.target.value = '';
                setPictureList(pictureList.concat(res as IPictureUpload[]));
            });
        }
    };

    const takePicture = () => {
        try {
            if (canvasRef != null && canvasRef.current != null && cameraVideo.current != null) {
                const canvas = canvasRef?.current?.getContext('2d');
                if (canvas != null) {
                    canvas.drawImage(cameraVideo.current, 0, 0, cameraVideo.current.width, cameraVideo.current.height);
                    var image = new Image();
                    image.src = canvasRef.current.toDataURL();
                    var name = 'cameraUpload_' + format(new Date(), 'dd-MM-yyyy_HH-mm-ss');
                    setPictureList(pictureList.concat({ name: name, base64: canvasRef.current.toDataURL() }));
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const startCamera = (visibile: boolean) => {
        try {
            setIsCameraActive(visibile);
            setNoCameraAvailableError(false);
            if (navigator?.mediaDevices) {
                if (cameraVideo?.current) {
                    navigator.mediaDevices
                        .getUserMedia({
                            video: {
                                facingMode: 'environment',
                                width: { ideal: matches ? 1080 : 2160 },
                                height: { ideal: matches ? 2160 : 1080 }
                            }
                        })
                        .then(function (stream) {
                            if (cameraVideo.current !== null) {
                                setIsShowPlaceholderIcon(false);
                                setCameraSettings(stream.getVideoTracks()[0].getSettings());
                                cameraVideo.current.srcObject = stream;
                                cameraVideo.current.setAttribute('playsinline', 'playsinline'); // required to tell iOS safari we don't want fullscreen
                                if (visibile) {
                                    cameraVideo.current.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'center',
                                        inline: 'nearest'
                                    });
                                    cameraVideo.current.play();
                                } else {
                                    cameraVideo.current.srcObject.getTracks().forEach((track) => track.stop());
                                    cameraVideo.current.srcObject.getAudioTracks().forEach((track) => track.stop());
                                    cameraVideo.current.srcObject.getVideoTracks().forEach((track) => track.stop());
                                    cameraVideo.current.pause();
                                }
                            } else {
                                console.log('Video stream is null.');
                                setIsShowPlaceholderIcon(true);
                                setNoCameraAvailableError(true);
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            setIsShowPlaceholderIcon(true);
                            setNoCameraAvailableError(true);
                        });
                }
            } else {
                setIsShowPlaceholderIcon(true);
                setNoCameraAvailableError(true);
            }
        } catch (error) {
            console.log(error);
            setIsShowPlaceholderIcon(true);
            setNoCameraAvailableError(true);
        }
    };

    useEffect(() => {
        const transformedList = pictureList?.map((pic) => {
            return { id: undefined, pictureUrl: pic.base64 };
        });
        if (transformedList) {
            setPictures(transformedList);
        }
    }, [pictureList]);

    useEffect(() => {
        startCamera(false);
    }, [matches]);

    return (
        <Container maxWidth="lg">
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                direction="row"
                sx={{
                    cursor: `${disabled ? 'not-allowed' : 'pointer'}`
                }}
            >
                <Button
                    variant="contained"
                    component="label"
                    color="secondary"
                    sx={{
                        width: '19.35em',
                        height: '4em',
                        margin: '0.5em',
                        border: `${!disabled ? (themeMode === 'dark' ? '1px solid' + darkGrey : '1px solid' + lightGrey) : null}`,
                        '&:hover': {
                            color: `${themeMode === 'dark' ? mainWhite : mainBlack}`,
                            backgroundColor: 'initial',
                            border: `1px solid ${themeMode === 'dark' ? mainWhite : mainBlack}`
                        }
                    }}
                    disabled={disabled}
                >
                    <UploadFile />
                    <Typography>&nbsp;&nbsp;Dateien hochladen&nbsp;&nbsp;&nbsp;</Typography>
                    <input
                        type="file"
                        hidden
                        multiple
                        accept=".jpg, .jpeg, .png, .gif, .bmp, .pdf"
                        onChange={(changeEvent) => transformPictures(changeEvent)}
                    />
                </Button>
                <Tooltip title={noCameraAvailableError ? 'Kamera nicht verfügbar.' : null}>
                    <div style={{ cursor: `${noCameraAvailableError ? 'not-allowed' : 'pointer'}` }} /* necessary to show tooltip */>
                        <Button
                            variant="contained"
                            component="label"
                            color="secondary"
                            onClick={() => startCamera(!isCameraActive)}
                            sx={{
                                width: '19.35em',
                                height: '4em',
                                margin: '0.5em',
                                border: `${!disabled ? (themeMode === 'dark' ? '1px solid' + darkGrey : '1px solid' + lightGrey) : null}`,
                                '&:hover': {
                                    color: `${themeMode === 'dark' ? mainWhite : mainBlack}`,
                                    backgroundColor: 'initial',
                                    border: `1px solid ${themeMode === 'dark' ? mainWhite : mainBlack}`
                                }
                            }}
                            disabled={noCameraAvailableError}
                        >
                            <CameraAlt />
                            <Typography>&nbsp;&nbsp;Kamera {isCameraActive ? 'stoppen' : 'starten'} &nbsp;&nbsp;&nbsp;</Typography>
                        </Button>
                    </div>
                </Tooltip>
            </Grid>
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                direction="row"
                display={isCameraActive ? 'flex' : 'none'}
            >
                {isShowPlaceholderIcon && (
                    <Box sx={{ m: 13.5 }}>
                        <PhotoCamera style={{ color: 'LightGray', transform: 'scale(6)' }} />
                    </Box>
                )}
                <video
                    ref={cameraVideo}
                    width={cameraSettings ? cameraSettings.width : 0}
                    height={cameraSettings ? cameraSettings.height : 0}
                    className={styles.video}
                    playsInline
                    hidden={isShowPlaceholderIcon}
                />
                <canvas
                    id="canvas"
                    width={cameraSettings ? cameraSettings.width : 0}
                    height={cameraSettings ? cameraSettings.height : 0}
                    ref={canvasRef}
                    className={styles.video}
                    hidden={isShowPlaceholderIcon}
                />
            </Grid>
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                direction="row"
                display={isCameraActive ? 'flex' : 'none'}
            >
                <CustomButton
                    onClick={() => takePicture()}
                    label="Foto aufnehmen"
                />
            </Grid>
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                direction="row"
            >
                <Box sx={{ marginTop: '10px', width: '17.5em' }}>
                    {pictureList?.map((pic, index) => (
                        <Box
                            key={`${pic.name}-${index}`}
                            sx={{ display: 'flex', flexFlow: 'row nowrap' }}
                        >
                            <Delete
                                sx={{ cursor: 'pointer' }}
                                onClick={() => setPictureList(pictureList?.filter((filterPic) => filterPic !== pic))}
                            />
                            <div>{pic.name}</div>
                        </Box>
                    ))}
                </Box>
            </Grid>
        </Container>
    );
};

export default ImageUpload;
