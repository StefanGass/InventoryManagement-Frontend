import { AppBar, Grid, IconButton, Toolbar, Typography, useMediaQuery } from '@mui/material';
import { FC, useContext, useEffect } from 'react';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { UserContext } from 'pages/_app';

const Footer: FC = () => {
    const { themeMode, setThemeMode } = useContext(UserContext);

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    useEffect(() => {
        if (prefersDarkMode) {
            setThemeMode('dark');
        }
    }, [prefersDarkMode]);

    const onClick = (e) => {
        e.preventDefault();
        if (themeMode === 'dark') {
            setThemeMode('light');
        } else {
            setThemeMode('dark');
        }
    };

    return (
        <>
            <AppBar
                position="relative"
                color="primary"
                enableColorOnDark
                sx={{ marginTop: '-3.5em' }}
            >
                <Toolbar>
                    <Grid
                        container
                        alignItems="center"
                        justifyContent="center"
                    >
                        <IconButton
                            sx={{ ml: 1, marginRight: '5px' }}
                            onClick={onClick}
                            color="inherit"
                        >
                            {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>
                        <Typography>Your company</Typography>
                    </Grid>
                </Toolbar>
            </AppBar>
        </>
    );
};

export default Footer;
