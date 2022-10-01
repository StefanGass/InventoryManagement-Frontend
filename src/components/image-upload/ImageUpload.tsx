import { ChangeEvent, FC, useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Delete, UploadFile } from '@mui/icons-material';
import { IPicture, IPictureUpload } from 'components/interfaces';
import { lightGrey, mainBlack } from 'styles/theme';

interface IImageUploadProps {
    setPictures: (pictures: IPicture[]) => void;
    disabled?: boolean;
}

const ImageUpload: FC<IImageUploadProps> = ({ setPictures, disabled }) => {
    const [pictureList, setPictureList] = useState<IPictureUpload[] | null>(null);

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
            setPictureList([]);

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
                setPictureList(res as IPictureUpload[]);
            });
        }
    };

    return (
        <Box sx={{ display: 'flex', flexFlow: 'column wrap', width: '100%', alignItems: 'center' }}>
            <Button
                variant="contained"
                component="label"
                color="secondary"
                sx={{
                    width: '19.35em',
                    height: '4em',
                    border: `1px solid ${lightGrey}`,
                    '&:hover': {
                        color: `${mainBlack}`,
                        backgroundColor: 'inherit',
                        border: `1px solid ${mainBlack}`
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
