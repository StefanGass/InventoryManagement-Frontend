import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
    AppBar,
    Box,
    Button,
    Grid,
    IconButton,
    keyframes,
    List,
    ListItemButton,
    ListItemText,
    SwipeableDrawer,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from 'components/layout/Link';
import defaultTheme, { darkGrey, darkTheme, errorRed, mainYellow, lightGrey, mainWhite } from 'styles/theme';
import logo from 'public/pictures/logo.png';
import { UserContext } from '../../../pages/_app';
import inventoryManagementService from 'service/inventoryManagementService';
import { IInventoryItem } from 'components/interfaces';
import TestsystemHint from 'components/layout/TestsystemHint';

interface IHeaderProps {
    resetUserContext: () => void;
}

const blink = keyframes`
    from {
        transform: scale(1);
    }
    50% {
        transform: scale(1.5);
    }
    to {
        transform: scale(1);
    }
`;

export default function Header(props: IHeaderProps) {
    const { resetUserContext } = props;
    const {
        isAuthenticated,
        departmentId,
        isAdmin,
        isSuperAdmin,
        isAdminModeActivated,
        availableRoutesList,
        themeMode,
        isDroppingReviewer,
        isNewTasksAvailable,
        setIsNewTasksAvailable
    } = useContext(UserContext);

    const router = useRouter();
    const matches = useMediaQuery(defaultTheme.breakpoints.down('sm'));

    function logoutClick() {
        resetUserContext();
        setIsOpenDrawer(false);
    }

    // blink when there's something in the queue
    useEffect(() => {
        let request: Promise<IInventoryItem[]>;
        if ((isSuperAdmin || isAdmin) && isAdminModeActivated) {
            request = inventoryManagementService.getAllDroppingQueueInventoryItems();
        } else {
            if (!isDroppingReviewer) {
                setIsNewTasksAvailable(false);
                return;
            }
            request = inventoryManagementService.getDroppingQueueInventoryItemsByDepartmentId(departmentId);
        }
        request
            .then((item) => {
                setIsNewTasksAvailable(!!item.length);
            })
            .catch((e) => console.log(e));
    }, [isDroppingReviewer, router.pathname, isAdminModeActivated]);

    // desktop mode
    const tabs = (
        <>
            <Grid
                container
                justifyContent="flex-end"
                alignItems="center"
                spacing={3}
            >
                {availableRoutesList.map(({ name, symbol, isUseSymbolInHeader, link }, index) => (
                    <Grid
                        item
                        key={link}
                    >
                        <Tooltip
                            title={isUseSymbolInHeader ? name : null}
                            enterDelay={500}
                            followCursor={true}
                        >
                            <Link
                                href={link}
                                underline="none"
                                id={'link' + name}
                            >
                                <Typography
                                    fontSize="1.25em"
                                    fontWeight={router.pathname === link ? 'bold' : 'normal'}
                                    component="div"
                                    color={
                                        router.pathname === link
                                            ? themeMode === 'dark'
                                                ? 'primary'
                                                : mainYellow
                                            : themeMode === 'dark'
                                              ? darkTheme.palette.common.white
                                              : defaultTheme.palette.common.white
                                    }
                                    sx={{
                                        height: '1.5em',
                                        marginTop: '6px',
                                        borderBottom: router.pathname === link ? '1px solid' : '0px',
                                        '&:hover': {
                                            color: themeMode === 'dark' ? darkTheme.palette.primary.main : defaultTheme.palette.secondary.main
                                        }
                                    }}
                                >
                                    {index === 4 && isNewTasksAvailable ? (
                                        <Box sx={{ animation: `${blink} 1s linear infinite` }}>{symbol}</Box>
                                    ) : isUseSymbolInHeader ? (
                                        symbol
                                    ) : (
                                        name
                                    )}
                                </Typography>
                            </Link>
                        </Tooltip>
                    </Grid>
                ))}
                <Tooltip
                    title="ABMELDEN"
                    enterDelay={500}
                    followCursor={true}
                >
                    <Grid item>
                        <Button
                            onClick={logoutClick}
                            sx={{
                                color: themeMode === 'dark' ? darkTheme.palette.common.white : defaultTheme.palette.common.white,
                                '&:hover': {
                                    background: errorRed,
                                    color: mainYellow
                                },
                                border: `1px solid ${themeMode === 'dark' ? darkTheme.palette.common.white : defaultTheme.palette.common.white}`,
                                fontSize: '20px'
                            }}
                        >
                            <Box
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexWrap: 'wrap'
                                }}
                            >
                                <LogoutIcon fontSize={'small'} />
                            </Box>
                        </Button>
                    </Grid>
                </Tooltip>
            </Grid>
        </>
    );

    // mobile mode
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const iOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

    const drawer = (
        <>
            <SwipeableDrawer
                disableBackdropTransition={!iOS}
                disableDiscovery={iOS}
                open={isOpenDrawer}
                onClose={() => setIsOpenDrawer(false)}
                onOpen={() => setIsOpenDrawer(true)}
                anchor="right"
            >
                <Box
                    marginTop="4em"
                    role="presentation"
                    sx={{ width: 200 }}
                >
                    <List disablePadding>
                        {availableRoutesList.map(({ name, symbol, link }, index) => (
                            <ListItemButton
                                key={link}
                                divider
                                onClick={() => {
                                    setIsOpenDrawer(false);
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
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            flexWrap="wrap"
                                            color={router.pathname === link ? 'primary' : themeMode === 'dark' ? darkTheme.palette.common.white : darkGrey}
                                        >
                                            {index === 4 && isNewTasksAvailable ? (
                                                <Box sx={{ animation: `${blink} 1s linear infinite` }}>{symbol}</Box>
                                            ) : (
                                                symbol
                                            )}
                                            <Typography
                                                fontSize="1.25rem"
                                                fontWeight={router.pathname === link ? 'bold' : 'normal'}
                                                lineHeight={1.167}
                                                marginLeft="0.4em"
                                            >
                                                {name}
                                            </Typography>
                                        </Box>
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
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    flexWrap="wrap"
                                >
                                    <LogoutIcon sx={{ color: errorRed }} />
                                    <Typography
                                        fontSize="1.25rem"
                                        fontWeight="normal"
                                        lineHeight={1.167}
                                        color={themeMode === 'dark' ? darkTheme.palette.common.white : darkGrey}
                                        marginLeft="0.4em"
                                    >
                                        ABMELDEN
                                    </Typography>
                                </Box>
                            </ListItemText>
                        </ListItemButton>
                    </List>
                </Box>
            </SwipeableDrawer>
            <IconButton
                onClick={() => setIsOpenDrawer(!isOpenDrawer)}
                disableRipple
                sx={{
                    marginLeft: 'auto',
                    padding: 0,
                    '&:hover': {
                        backgroundColor: 'transparent'
                    }
                }}
            >
                <MenuIcon style={{ height: '35px', width: '35px', color: mainWhite }} />
            </IconButton>
        </>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            {process.env.HOSTNAME && !process.env.HOSTNAME.includes('kultur-burgenland') && <TestsystemHint />}
            <AppBar>
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
                            style={{ marginTop: '8px' }}
                            priority
                        />
                    </Link>
                    {isAuthenticated && (matches ? drawer : tabs)}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
