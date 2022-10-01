import { FC, useState } from 'react';
import { IPicture } from 'components/interfaces';
import { Box } from '@mui/material';
import styles from 'styles/ImageGallery.module.scss';

interface IImageGalleryProps {
    images: IPicture[];
}

const ImageGallery: FC<IImageGalleryProps> = ({ images }) => {
    const [activeImage, setActiveImage] = useState<IPicture | null>(images[0]);

    const getImages = () => {
        if (images) {
            return (
                <div className={styles.thumbnailcontainer}>
                    {images.map((picture, index) => {
                        const image = new Image();
                        image.src = picture.pictureUrl as string;
                        return (
                            <div
                                key={`picture-${picture.id}-${index}`}
                                className={picture.id === activeImage?.id ? `${styles.thumbnail} ${styles.active}` : styles.thumbnail}
                                onClick={() => setActiveImage(picture)}
                            >
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                />
                            </div>
                        );
                    })}
                </div>
            );
        } else {
            return null;
        }
    };

    return (
        <Box>
            <div
                className={styles.image}
                onClick={() => {
                    const image = new Image();
                    image.src = activeImage?.pictureUrl as string;
                    const w = window.open('', '', 'popup');
                    if (w) {
                        w.document.write(image.outerHTML);
                    }
                }}
            >
                <img
                    src={activeImage?.pictureUrl as string}
                    alt="active image"
                />
            </div>
            {getImages()}
        </Box>
    );
};

export default ImageGallery;
