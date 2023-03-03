import { Alert, Grid, Stack } from '@mui/material';
import { FC } from 'react';

interface ICustomAlertProps {
    state: 'success' | 'warning' | 'error';
    message: string;
}

const CustomAlert: FC<ICustomAlertProps> = (props) => {
    const { state, message } = props;
    return (
        <Grid
            container
            justifyContent="center"
        >
            <Stack
                sx={{
                    width: '17em',
                    marginTop: '0.8em',
                    marginBottom: '0.5em'
                }}
                spacing={2}
            >
                <Alert severity={state}>{message}</Alert>
            </Stack>
        </Grid>
    );
};

export default CustomAlert;
