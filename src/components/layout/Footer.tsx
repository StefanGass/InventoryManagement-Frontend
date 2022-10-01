import { AppBar, Grid, Toolbar, Typography } from '@mui/material';

const Footer = () => {
    return (
        <>
            <AppBar
                position="relative"
                color="primary"
                sx={{ marginTop: '-3.5em' }}
            >
                <Toolbar>
                    <Grid
                        container
                        justifyContent="center"
                    >
                        <Typography>Your company</Typography>
                    </Grid>
                </Toolbar>
            </AppBar>
        </>
    );
};

export default Footer;
