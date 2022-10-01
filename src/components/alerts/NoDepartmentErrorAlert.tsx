import { Alert, Box, Container, Grid, Stack } from '@mui/material';

const ServerErrorAlert = () => {
    return (
        <Container maxWidth="sm">
            <Box sx={{ my: 12 }}>
                <Grid
                    container
                    justifyContent="center"
                >
                    <Stack
                        sx={{ width: '20em', marginTop: '1em' }}
                        spacing={2}
                    >
                        <Alert severity="warning">Du wurdest noch keiner Abteilung zugewiesen! Wende dich bitte an einen Administrator!</Alert>
                    </Stack>
                </Grid>
            </Box>
        </Container>
    );
};

export default ServerErrorAlert;
