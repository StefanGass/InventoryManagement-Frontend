import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Box, Button, Container, Grid, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { Camera, CameraAlt, Delete, NoPhotography, PhotoCamera, UploadFile } from '@mui/icons-material';
import { IPicture, IPictureUpload } from 'components/interfaces';
import lightTheme from 'styles/theme';
import { format } from 'date-fns';
import styles from 'styles/ImageUpload.module.scss';
import CustomButton from 'components/form-fields/CustomButton';
import useIsFirstRender from 'hooks/useIsFirstRender';

interface IImageUploadProps {
    setPictures: (pictures: IPicture[]) => void;
    pictureList: IPictureUpload[];
    setPictureList: (list: IPictureUpload[]) => void;
    isDisabled?: boolean;
}

export default function ImageUpload(props: IImageUploadProps) {
    const { setPictures, pictureList, setPictureList, isDisabled } = props;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cameraVideo = useRef<HTMLVideoElement>(null);
    const [noCameraAvailableError, setNoCameraAvailableError] = useState(false);
    const [isShowPlaceholderIcon, setIsShowPlaceholderIcon] = useState(true);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraSettings, setCameraSettings] = useState<MediaTrackSettings | null>(null);
    const matches = useMediaQuery(lightTheme.breakpoints.down('md'));

    const isFirstRender = useIsFirstRender();

    async function transformPictures(changeEvent: ChangeEvent<HTMLInputElement>) {
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
    }

    function takePicture() {
        try {
            if (canvasRef != null && canvasRef.current != null && cameraVideo.current != null) {
                const canvas = canvasRef?.current?.getContext('2d');
                if (canvas != null) {
                    canvas.drawImage(cameraVideo.current, 0, 0, cameraVideo.current.width, cameraVideo.current.height);
                    let image = new Image();
                    image.src = canvasRef.current.toDataURL();
                    let name = 'cameraUpload_' + format(new Date(), 'dd-MM-yyyy_HH-mm-ss');
                    setPictureList(pictureList.concat({ name: name, base64: canvasRef.current.toDataURL() }));
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const startCamera = (visible: boolean) => {
        try {
            setIsCameraActive(visible);
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
                                if (visible) {
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
        if (!isFirstRender) {
            startCamera(false);
        }
    }, [matches]);

    return (
        <Container maxWidth="lg">
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                direction="row"
                sx={{
                    cursor: `${isDisabled ? 'not-allowed' : 'pointer'}`
                }}
            >
                <Button
                    variant="contained"
                    component="label"
                    color="info"
                    sx={{
                        width: '19.35em',
                        height: '4em',
                        margin: '0.5em'
                    }}
                    disabled={isDisabled}
                >
                    <UploadFile />
                    <Typography>&nbsp;&nbsp;Dokumente hinzufügen</Typography>
                    <input
                        type="file"
                        hidden
                        multiple
                        accept=".jpg, .jpeg, .png, .gif, .bmp, .pdf"
                        onChange={(changeEvent) => transformPictures(changeEvent)}
                    />
                </Button>
                <Tooltip
                    title={noCameraAvailableError ? 'Kamera nicht verfügbar.' : null}
                    enterDelay={500}
                    followCursor={true}
                >
                    <Box style={{ cursor: `${noCameraAvailableError ? 'not-allowed' : 'pointer'}` }} /* necessary to show tooltip */>
                        <Button
                            variant="contained"
                            component="label"
                            color="info"
                            onClick={() => startCamera(!isCameraActive)}
                            sx={{
                                width: '19.35em',
                                height: '4em',
                                margin: '0.5em'
                            }}
                            disabled={noCameraAvailableError}
                        >
                            {isCameraActive ? <NoPhotography /> : <CameraAlt />}
                            <Typography>&nbsp;&nbsp;{isCameraActive ? 'Aufnahme stoppen' : 'Bilder aufnehmen'}</Typography>
                        </Button>
                    </Box>
                </Tooltip>
            </Grid>
            {!noCameraAvailableError && (
                <>
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
                            id="video"
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
                            symbol={<Camera />}
                        />
                    </Grid>
                </>
            )}
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                direction="row"
            >
                <Box sx={{ marginTop: '10px', marginBottom: '10px', width: '17.5em' }}>
                    {pictureList?.map((pic, index) => (
                        <Box
                            key={`${pic.name}-${index}`}
                            sx={{ display: 'flex', flexFlow: 'row nowrap' }}
                        >
                            <Delete
                                sx={{ cursor: 'pointer' }}
                                onClick={() => setPictureList(pictureList?.filter((filterPic) => filterPic !== pic))}
                            />
                            <Box>{pic.name}</Box>
                        </Box>
                    ))}
                </Box>
            </Grid>
        </Container>
    );
}
