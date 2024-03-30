import { Alert, Grid, Stack } from '@mui/material';

interface ICustomAlertProps {
    state: 'success' | 'warning' | 'error' | 'info';
    message: string;
}

export default function CustomAlert(props: ICustomAlertProps) {
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
}
