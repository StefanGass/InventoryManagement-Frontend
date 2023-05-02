import {ChangeEvent, FC, useContext, useEffect, useRef, useState} from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import {CameraAlt, Delete, UploadFile} from '@mui/icons-material';
import { IPicture, IPictureUpload } from 'components/interfaces';
import { darkGrey, lightGrey, mainBlack, mainWhite } from 'styles/theme';
import { UserContext } from 'pages/_app';
import { format } from 'date-fns'

interface IImageUploadProps {
    setPictures: (pictures: IPicture[]) => void;
    disabled?: boolean;
}

const ImageUpload: FC<IImageUploadProps> = ({ setPictures, disabled }) => {
    const [pictureList, setPictureList] = useState<IPictureUpload[]>([]);
    const { themeMode } = useContext(UserContext);
    const [value, setValue] = useState('');
    const [error, setError] = useState(false);
    const [scan, setScan] = useState(false);
    const [scanError, setScanError] = useState(false);
    const [placeholderIcon, setPlaceholderIcon] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const qrVideo = useRef<HTMLVideoElement>(null);
    const [camera, setCamera] = useState(false);

    useEffect(() => {
        const transformedList = pictureList?.map((pic) => {
            return { id: undefined, pictureUrl: pic.base64 };
        });
        if (transformedList) {
            setPictures(transformedList);
        }
    }, [pictureList]);

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
    const makePicture = (boo) => {
        try{
            if (canvasRef != null && canvasRef.current != null && qrVideo.current != null) {
                const canvas = canvasRef?.current?.getContext('2d');
                if(canvas !=null){
                    canvas.drawImage(qrVideo?.current, 0, 0, qrVideo.current.width, qrVideo.current?.height);
                    const imageData = canvas.getImageData(0, 0, qrVideo?.current?.width, qrVideo?.current?.height);
                    console.log(imageData);
                    const bild = canvasRef.current.toDataURL();
                    console.log(canvasRef.current.toDataURL())
                    var image = new Image();
                    image.src = bild;
                    var name = "cameraUpload_" + format(new Date(), 'dd-MM-yyyy_HH-mm-ss')
                    setPictureList(pictureList.concat(({ name: name, base64: canvasRef.current.toDataURL()})));
                }
            }
        }catch(error){
           console.log(error);
        }
    };
    const startCamera = (visibile: boolean) => {
        try {
            setCamera(visibile);
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
                                if (visibile) {
                                    qrVideo.current.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'center',
                                        inline: 'nearest'
                                    });

                                    qrVideo.current.play();

                                } else {
                                    qrVideo.current.srcObject.getTracks().forEach(track => track.stop()) ;
                                    qrVideo.current.srcObject.getAudioTracks().forEach(track => track.stop()) ;
                                    qrVideo.current.srcObject.getVideoTracks().forEach(track => track.stop()) ;
                                    qrVideo.current.pause();

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
                            console.log()
                        });
                }
            } else {
                console.log('No camera device found.');
                setScan(false);
                setPlaceholderIcon(true);
                setScanError(true);
                setError(true);
                console.log(value);
                console.log(error);
                console.log(scan);
                console.log(scanError);
                console.log(placeholderIcon);
            }
        }catch (error){
        }
    };



    return (
        <Box sx={{ display: 'flex', flexFlow: 'column wrap', width: '100%', alignItems: 'center' }}>
            <Grid sx={{ cursor: `${disabled ? 'not-allowed' : 'pointer'}` }}>
                <Button
                    variant="contained"
                    component="label"
                    color="secondary"
                    sx={{
                        width: '19.35em',
                        height: '4em',
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

                <Button
                    variant="contained"
                    component="label"
                    color="secondary"
                    //ref={kameraEinButton}
                    onClick={() => startCamera(!camera)}
                    sx={{
                        marginLeft: '10px',
                        width: '19.35em',
                        height: '4em',
                        border: `${!disabled ? (themeMode === 'dark' ? '1px solid' + darkGrey : '1px solid' + lightGrey) : null}`,
                        '&:hover': {
                            color: `${themeMode === 'dark' ? mainWhite : mainBlack}`,
                            backgroundColor: 'initial',
                            border: `1px solid ${themeMode === 'dark' ? mainWhite : mainBlack}`
                        }
                    }}
                    disabled={disabled}
                >
                    <CameraAlt />
                    <Typography>&nbsp;&nbsp;Kamera {camera?'stoppen':'starten'} &nbsp;&nbsp;&nbsp;</Typography>
                </Button>



                    <div style={{display: camera? 'flex': 'none'}}>
                        <video
                            ref={qrVideo}
                            width="500px"
                            height="375px"
                            style={{  marginTop: '50px', display: 'block' }}
                        />

                        <canvas style={{marginRight: '10px',marginTop:'50px', marginLeft: '10px'}}
                            /* Necessary for reading QR code from scanner */
                                id="canvas"
                                width="500px"
                                height="375px"
                                ref={canvasRef}
                        />
                    </div>



            <div style={{display: camera? '': 'none'}}>
                <Button
                    onClick={() => makePicture(true)}
                    style={{width:'100%'}}
                >
                    Foto aufnehmen
                </Button>
            </div>

            </Grid>
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
        </Box>
    );
};

export default ImageUpload;
