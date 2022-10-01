import { Alert, Grid, Stack } from '@mui/material';

const ServerErrorAlert = () => {
    return (
        <Grid
            container
            justifyContent="center"
        >
            <Stack
                sx={{ width: '20em', marginTop: '1em' }}
                spacing={2}
            >
                <Alert severity="warning">Serverfehler - bitte kontaktiere die IT!</Alert>
            </Stack>
        </Grid>
    );
};

export default ServerErrorAlert;
