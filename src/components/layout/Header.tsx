import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
    AppBar,
    Box,
    Button,
    Grid,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    styled,
    SwipeableDrawer,
    Toolbar,
    Typography,
    useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from 'components/layout/Link';
import { routes } from 'utils/routes';
import theme, { darkGrey, errorRed, lightGrey, mainWhite } from 'styles/theme';
import logo from 'public/pictures/logo.png';

interface LoginProps {
    login: boolean;
    setLogin: (bool: boolean) => void;
}

const StyledTypographyDesktop = styled(Typography)({
    fontSize: '1.25em',
    color: theme.palette.secondary.main,
    '&:hover': {
        color: theme.palette.info.main
    },
    marginTop: '2px'
});

const StyledLogoutButtonDesktop = styled(Button)({
    color: theme.palette.secondary.main,
    '&:hover': {
        background: errorRed,
        color: theme.palette.info.main
    },
    border: `1px solid ${theme.palette.common.white}`,
    fontSize: '20px',
    width: '7em'
});

const StyledIconButtonDrawer = styled(IconButton)({
    marginLeft: 'auto',
    padding: 0,
    '&:hover': {
        backgroundColor: 'transparent'
    }
});

const Header: FC<LoginProps> = (props) => {
    const { login, setLogin } = props;

    const router = useRouter();
    const matches = useMediaQuery(theme.breakpoints.down('md'));

    const logoutClick = () => {
        setOpenDrawer(false);
        if (setLogin) {
            setLogin(false);
        }
    };

    // desktop mode
    const tabs = (
        <>
            <Grid
                container
                justifyContent="flex-end"
                spacing={4}
            >
                {routes.map(({ name, link }) => (
                    <Grid
                        item
                        key={link}
                    >
                        <Link href={link}>
                            <StyledTypographyDesktop
                                style={{
                                    fontWeight: router.pathname === link ? 'bold' : 'normal',
                                    borderBottom: router.pathname === link ? '0.5px solid' : '0px'
                                }}
                            >
                                {name}
                            </StyledTypographyDesktop>
                        </Link>
                    </Grid>
                ))}
                <Grid item>
                    <StyledLogoutButtonDesktop onClick={logoutClick}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexWrap: 'wrap'
                            }}
                        >
                            <LogoutIcon fontSize={'small'} />
                            <Typography>&nbsp;Abmelden</Typography>
                        </div>
                    </StyledLogoutButtonDesktop>
                </Grid>
            </Grid>
        </>
    );

    // mobile mode
    const [openDrawer, setOpenDrawer] = useState(false);
    const iOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

    const drawer = (
        <>
            <SwipeableDrawer
                disableBackdropTransition={!iOS}
                disableDiscovery={iOS}
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                onOpen={() => setOpenDrawer(true)}
                anchor="right"
            >
                <div style={{ ...theme.mixins.toolbar, marginBottom: '2em' }} />
                <Box
                    sx={{ width: 200 }}
                    role="presentation"
                >
                    <List disablePadding>
                        {routes.map(({ name, link }) => (
                            <ListItemButton
                                key={link}
                                divider
                                onClick={() => {
                                    setOpenDrawer(false);
                                }}
                            >
                                <ListItemText>
                                    <Link
                                        href={link}
                                        underline="none"
                                    >
                                        <Typography
                                            variant="h3"
                                            style={{
                                                color: router.pathname === link ? 'primary' : darkGrey,
                                                fontWeight: router.pathname === link ? 'bold' : 'normal'
                                            }}
                                        >
                                            {name}
                                        </Typography>
                                    </Link>
                                </ListItemText>
                            </ListItemButton>
                        ))}
                        <ListItemButton
                            onClick={logoutClick}
                            sx={{
                                '&:hover': {
                                    backgroundColor: lightGrey
                                }
                            }}
                        >
                            <ListItemText disableTypography>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexWrap: 'wrap'
                                    }}
                                >
                                    <LogoutIcon style={{ color: errorRed }} />
                                    <Typography
                                        variant="h3"
                                        style={{ color: darkGrey }}
                                    >
                                        &nbsp;Abmelden
                                    </Typography>
                                </div>
                            </ListItemText>
                        </ListItemButton>
                    </List>
                </Box>
            </SwipeableDrawer>
            <StyledIconButtonDrawer
                onClick={() => setOpenDrawer(!openDrawer)}
                disableRipple
            >
                <MenuIcon style={{ height: '35px', width: '35px', color: mainWhite }} />
            </StyledIconButtonDrawer>
        </>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar>
                <Toolbar
                    disableGutters
                    style={{
                        height: '4.5em',
                        maxWidth: '1280px',
                        margin: '0 auto',
                        width: '96%',
                        padding: matches ? '0 8px' : '8px'
                    }}
                >
                    <Link href="/">
                        <Grid container alignItems="center">
                            <Image
                                alt="IM"
                                src={logo}
                                height="45px"
                                width="150px"
                                layout="fixed"
                                priority
                            />
                        </Grid>
                    </Link>
                    {login && (matches ? drawer : tabs)}
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Header;
