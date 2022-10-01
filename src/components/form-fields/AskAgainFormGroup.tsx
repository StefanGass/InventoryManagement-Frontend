import { FC } from 'react';
import { Alert, Box, Stack } from '@mui/material';
import CustomButton from 'components/form-fields/CustomButton';
import { Add, Repeat } from '@mui/icons-material';

interface IAskAgainFormGroupProps {
    setAskAgain: (bool: boolean) => void;
    setDefaultForm: () => void;
}

const AskAgainFormGroup: FC<IAskAgainFormGroupProps> = ({ setAskAgain, setDefaultForm }) => (
    <Box sx={{ display: 'flex', flexFlow: 'column wrap', width: '100%', alignItems: 'center' }}>
        <Stack
            sx={{
                width: '17em',
                marginTop: '0.8em',
                marginBottom: '0.5em'
            }}
            spacing={2}
        >
            <Alert severity="success">Inventargegenstand erfolgreich angelegt!</Alert>
        </Stack>
        <CustomButton
            label="Inventargegenstand erneut anlegen"
            onClick={() => setAskAgain(false)}
            symbol={<Repeat />}
        />
        <CustomButton
            label="Neuen Gegenstand anlegen"
            onClick={() => {
                setDefaultForm();
                setAskAgain(false);
            }}
            symbol={<Add />}
        />
    </Box>
);

export default AskAgainFormGroup;
