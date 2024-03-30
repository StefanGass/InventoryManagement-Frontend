import { Box, CircularProgress } from '@mui/material';

export default function LoadingSpinner() {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            marginTop="4em"
            sx={{ display: 'flex' }}
        >
            <CircularProgress />
        </Box>
    );
}
