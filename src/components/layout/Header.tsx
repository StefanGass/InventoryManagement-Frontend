import { useContext, useEffect, useState } from "react";
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
import FlagIcon from '@mui/icons-material/Flag';
import Link from 'components/layout/Link';
import { routes } from 'utils/routes';
import lightTheme, { darkGrey, errorRed, lightGrey, mainWhite } from 'styles/theme';
import logo from 'public/pictures/logo.png';
import { UserContext } from 'pages/_app';
import inventoryManagementService from "service/inventoryManagementService";
import { IInventoryItem } from "components/interfaces";

const StyledTypographyDesktop = styled(Typography)({
    fontSize: '1.25em',
    color: lightTheme.palette.secondary.main,
    '&:hover': {
        color: lightTheme.palette.info.main
    },
    marginTop: '2px'
});

const StyledLogoutButtonDesktop = styled(Button)({
    color: lightTheme.palette.secondary.main,
    '&:hover': {
        background: errorRed,
        color: lightTheme.palette.info.main
    },
    border: `1px solid ${lightTheme.palette.common.white}`,
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

const Header = () => {
    const { login, setLogin,departmentId, setUserId, setFirstName, setLastName, setAdmin, setSuperAdmin, setAdminMode,
        showDroppingQueue, droppingReviewer,setShowDroppingQueue,
        setDepartmentId, setDepartmentName, admin,adminMode,superAdmin, themeMode } =
        useContext(UserContext);

    const router = useRouter();
    const matches = useMediaQuery(lightTheme.breakpoints.down('md'));

    const logoutClick = () => {
        setOpenDrawer(false);
        if (setLogin) {
            setLogin(false);
        }
        if (setUserId) {
            setUserId(-1);
        }
        if (setFirstName) {
            setFirstName('');
        }
        if (setLastName) {
            setLastName('');
        }
        if (setAdmin) {
            setAdmin(false);
        }
        if (setSuperAdmin) {
            setSuperAdmin(false);
        }
        if (setAdminMode) {
            setAdminMode(false);
        }
        if (setDepartmentId) {
            setDepartmentId(-1);
        }
        if (setDepartmentName) {
            setDepartmentName('');
        }
    };

    useEffect(() =>{
        let request: Promise<IInventoryItem[]>;
        if ((superAdmin || admin) && adminMode) {
            request = inventoryManagementService.getAllDroppingQueueInventoryItems();
        } else {
            if(!droppingReviewer) return;
            request = inventoryManagementService.getDroppingQueueInventoryItemsByDepartmentId(departmentId);
        }
        request.then(x => {
            setShowDroppingQueue(!!x.length);
        }).catch(x => console.log(x));
    },[adminMode]);

    // desktop mode
    const tabs = (
        <>
            <Grid
                container
                justifyContent="flex-end"
                spacing={4}
            >
                {routes.filter(x => x.visibleMenu).map(({ name, link }) => (
                    <Grid
                        item
                        key={link}
                    >
                        <Link
                            href={link}
                            underline="none"
                            id={"link"+ name}
                        >
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
                {showDroppingQueue? (<Grid item>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            marginTop: '4px'
                        }}
                    >
                        <StyledTypographyDesktop>
                            <Link href="/warteschlange" underline="none" id="linkWarteschlange">
                                <FlagIcon fontSize='small' style={{ color: mainWhite }} />
                            </Link>
                        </StyledTypographyDesktop>

                    </div>
                </Grid>): (<></>)}

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
                <div style={{ ...lightTheme.mixins.toolbar, marginBottom: '2em' }} />
                <Box
                    sx={{ width: 200 }}
                    role="presentation"
                >
                    <List disablePadding>
                        {routes.filter(x => x.visibleHamburger).filter(x => {
                            if(x.name === "Warteschlange") {
                                return showDroppingQueue;
                            }
                            return true;
                        }).map(({ name, link }) => (
                            <ListItemButton
                                key={link}
                                divider
                                onClick={() => {
                                    setOpenDrawer(false);
                                }}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: `${themeMode === 'dark' ? darkGrey : lightGrey}`
                                    }
                                }}
                            >
                                <ListItemText>
                                    <Link
                                        href={link}
                                        underline="none"
                                    >
                                        <Typography
                                            variant="h3"
                                            sx={{
                                                color:
                                                    router.pathname === link
                                                        ? themeMode === 'dark'
                                                            ? mainWhite
                                                            : 'primary'
                                                        : themeMode === 'dark'
                                                        ? lightGrey
                                                        : darkGrey,
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
                                    backgroundColor: `${themeMode === 'dark' ? darkGrey : lightGrey}`
                                }
                            }}
                        >
                            <ListItemText>
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
                                        style={{ color: themeMode === 'dark' ? lightGrey : darkGrey }}
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
            <AppBar enableColorOnDark>
                <Toolbar
                    disableGutters
                    style={{
                        height: '4.5em',
                        margin: '0 auto',
                        width: '96%',
                        padding: matches ? '0 8px' : '8px'
                    }}
                >
                    <Link href="/">
                        <Image
                            alt="Inventory Management"
                            src={logo}
                            height={50}
                            width={170}
                            style={{marginTop: '9px'}}
                            priority
                        />
                    </Link>
                    {login && (matches ? drawer : tabs)}
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Header;
