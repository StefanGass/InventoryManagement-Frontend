import { AppBar, Button, Grid, Toolbar, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { useContext, useEffect } from 'react';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { UserContext } from '../../../pages/_app';
import defaultTheme, { darkTheme, mainYellow, mainWhite } from 'styles/theme';
import Link from 'components/layout/Link';

export default function Footer() {
    const { themeMode, setThemeMode } = useContext(UserContext);

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    useEffect(() => {
        if (prefersDarkMode) {
            setThemeMode('dark');
        }
    }, [prefersDarkMode]);

    const onChangeThemeModeClick = (e) => {
        e.preventDefault();
        if (themeMode === 'dark') {
            setThemeMode('light');
        } else {
            setThemeMode('dark');
        }
    };

    return (
        <AppBar
            position="relative"
            sx={{ marginTop: '-3.5em' }}
        >
            <Toolbar>
                <Grid
                    container
                    alignItems="center"
                    justifyContent="center"
                    margin="1.2em"
                >
                    <Typography align="center">© YOUR COMPANY</Typography>
                    <Typography sx={{ marginLeft: '8px', marginRight: '8px' }}>|</Typography>
                    <Link
                        href="https://YOUR.DOMAIN.NET/"
                        target="_blank"
                        rel="noopener noreferrer"
                        color={mainWhite}
                        underline="none"
                        sx={{
                            '&:hover': {
                                cursor: 'pointer',
                                color: themeMode === 'dark' ? darkTheme.palette.primary.main : mainYellow
                            }
                        }}
                    >
                        Impressum
                    </Link>
                    <Typography sx={{ marginLeft: '8px', marginRight: '8px' }}>|</Typography>
                    <Link
                        href="https://YOUR.DOMAIN.NET/"
                        target="_blank"
                        rel="noopener noreferrer"
                        color={mainWhite}
                        underline="none"
                        sx={{
                            '&:hover': {
                                cursor: 'pointer',
                                color: themeMode === 'dark' ? darkTheme.palette.primary.main : mainYellow
                            }
                        }}
                    >
                        Datenschutz
                    </Link>
                    <Typography sx={{ marginLeft: '8px', marginRight: '8px' }}>|</Typography>
                    <Link
                        href="https://YOUR.DOMAIN.NET/"
                        target="_blank"
                        rel="noopener noreferrer"
                        color={mainWhite}
                        underline="none"
                        sx={{
                            '&:hover': {
                                cursor: 'pointer',
                                color: themeMode === 'dark' ? darkTheme.palette.primary.main : mainYellow
                            }
                        }}
                    >
                        Barrierefreiheit
                    </Link>
                    <Typography sx={{ marginLeft: '8px', marginRight: '6px' }}>|</Typography>
                    <Tooltip
                        title={themeMode === 'dark' ? 'Helles Design aktivieren' : 'Dunkles Design aktivieren'}
                        enterDelay={500}
                        followCursor={true}
                    >
                        <Button
                            onClick={onChangeThemeModeClick}
                            sx={{
                                minWidth: 0,
                                padding: 0,
                                color: themeMode === 'dark' ? darkTheme.palette.common.white : defaultTheme.palette.common.white,
                                '&:hover': {
                                    color: themeMode === 'dark' ? darkTheme.palette.primary.main : mainYellow
                                }
                            }}
                        >
                            {themeMode === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
                        </Button>
                    </Tooltip>
                </Grid>
            </Toolbar>
        </AppBar>
    );
}
