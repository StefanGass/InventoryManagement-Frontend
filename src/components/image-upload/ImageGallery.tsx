import { useContext, useState } from 'react';
import { IPicture } from 'components/interfaces';
import { Box, Container, useMediaQuery } from '@mui/material';
import styles from 'styles/ImageGallery.module.scss';
import { UserContext } from '../../../pages/_app';
import defaultTheme from 'styles/theme';
import inventoryManagementService from 'service/inventoryManagementService';

interface IImageGalleryProps {
    images: IPicture[];
}

export default function ImageGallery(props: IImageGalleryProps) {
    const { images} = props;
    const [activeImage, setActiveImage] = useState<IPicture | null>(images[0]);
    const { themeMode } = useContext(UserContext);
    const matchesTablet = useMediaQuery(defaultTheme.breakpoints.down('md'));

    function openPictureInPopUp(picture: IPicture | null) {
        const image = new Image();
        image.style.maxWidth = '100%';
        image.style.maxHeight = '100%';
        image.src = picture?.pictureUrl as string;
        const w = window.open('', '', 'popup');
        if (w) {
            w.document.body.style.margin = '0';
            w.document.body.style.height = '100vh';
            w.document.body.style.display = 'flex';
            w.document.body.style.justifyContent = 'center';
            w.document.body.style.alignItems = 'center';
            w.document.body.appendChild(image);
        }
    }

    function onOpen() {
        if (activeImage?.thumbnailUrl) {
            inventoryManagementService
                .getPicture(activeImage.id as number)
                .then((picture) => {
                    openPictureInPopUp(picture);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            openPictureInPopUp(activeImage);
        }
    }

    function getImages() {
        if (images) {
            return (
                <Box className={images.length < 4 && !matchesTablet ? styles.thumbnailcontainer : `${styles.thumbnailcontainer} ${styles.morethanthree}`}>
                    {images.map((picture, index) => {
                        const image = new Image();
                        image.src = picture.thumbnailUrl ? (picture.thumbnailUrl as string) : (picture.pictureUrl as string);
                        return (
                            <Box
                                key={`picture-${picture.id}-${index}`}
                                className={
                                    picture.id === activeImage?.id
                                        ? themeMode === 'dark'
                                            ? `${styles.thumbnail} ${styles.activedarkmode}`
                                            : `${styles.thumbnail} ${styles.activelightmode}`
                                        : themeMode === 'dark'
                                        ? `${styles.thumbnail} ${styles.darkmode}`
                                        : `${styles.thumbnail} ${styles.lightmode}`
                                }
                                onClick={() => setActiveImage(picture)}
                            >
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                />
                            </Box>
                        );
                    })}
                </Box>
            );
        } else {
            return null;
        }
    }

    return matchesTablet ? (
        <Container disableGutters>
            <Box
                className={themeMode === 'dark' ? `${styles.image} ${styles.darkmode}` : `${styles.image} ${styles.lightmode}`}
                onClick={() => onOpen()}
            >
                <img
                    src={activeImage?.thumbnailUrl ? (activeImage?.thumbnailUrl as string) : (activeImage?.pictureUrl as string)}
                    alt="Zurzeit ausgewähltes Bild des Inventargegenstands"
                />
            </Box>
            {getImages()}
        </Container>
    ) : (
        <Container
            sx={{
                display: 'flex',
                flexFlow: 'row nowrap'
            }}
            disableGutters
        >
            <Box
                className={themeMode === 'dark' ? `${styles.image} ${styles.darkmode}` : `${styles.image} ${styles.lightmode}`}
                onClick={() => onOpen()}
                style={{ marginRight: '10px' }}
            >
                <img
                    src={activeImage?.thumbnailUrl ? (activeImage?.thumbnailUrl as string) : (activeImage?.pictureUrl as string)}
                    alt="Zurzeit ausgewähltes Bild des Inventargegenstands"
                />
            </Box>
            {getImages()}
        </Container>
    );
}
