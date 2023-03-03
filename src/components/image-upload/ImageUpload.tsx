import { ChangeEvent, FC, useContext, useEffect, useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { Delete, UploadFile } from '@mui/icons-material';
import { IPicture, IPictureUpload } from 'components/interfaces';
import { darkGrey, lightGrey, mainBlack, mainWhite } from 'styles/theme';
import { UserContext } from 'pages/_app';

interface IImageUploadProps {
    setPictures: (pictures: IPicture[]) => void;
    disabled?: boolean;
}

const ImageUpload: FC<IImageUploadProps> = ({ setPictures, disabled }) => {
    const [pictureList, setPictureList] = useState<IPictureUpload[] | null>(null);
    const { themeMode } = useContext(UserContext);

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
