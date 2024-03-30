import { createContext, useState } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import defaultTheme, { darkTheme } from 'styles/theme';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import LoginForm from 'components/forms/LoginForm';
import createEmotionCache from 'utils/createEmotionCache';
import { IRoute, IUserContext, IUserContextWithoutSetters } from 'components/interfaces';
import CustomAlert from 'components/form-fields/CustomAlert';
import { Container } from '@mui/material';
import { Box } from '@mui/system';
import { RedirectBoundary } from 'next/dist/client/components/redirect-boundary';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
}

export const UserContext = createContext<IUserContext>({} as IUserContext);

export default function MyApp(props: MyAppProps) {
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

    const userContextInitialState: IUserContextWithoutSetters = {
        authHeaders: new Headers(),
        isAuthenticated: false,
        availableRoutesList: [],
        userId: -1,
        firstName: '',
        lastName: '',
        isDroppingReviewer: false,
        isNewTasksAvailable: false,
        isAdmin: false,
        isSuperAdmin: false,
        isAdminModeActivated: false,
        departmentId: -1,
        departmentName: '',
        themeMode: 'light'
    };

    const [authHeaders, setAuthHeaders] = useState(userContextInitialState.authHeaders);
    const [isAuthenticated, setIsAuthenticated] = useState(userContextInitialState.isAuthenticated);
    const [availableRoutesList, setAvailableRoutesList] = useState<IRoute[]>(userContextInitialState.availableRoutesList);
    const [userId, setUserId] = useState(userContextInitialState.userId);
    const [firstName, setFirstName] = useState(userContextInitialState.firstName);
    const [lastName, setLastName] = useState(userContextInitialState.lastName);
    const [isDroppingReviewer, setIsDroppingReviewer] = useState(false);
    const [isNewTasksAvailable, setIsNewTasksAvailable] = useState(false);
    const [isAdmin, setIsAdmin] = useState(userContextInitialState.isAdmin);
    const [isSuperAdmin, setIsSuperAdmin] = useState(userContextInitialState.isSuperAdmin);
    const [isAdminModeActivated, setIsAdminModeActivated] = useState(userContextInitialState.isAdminModeActivated);
    const [departmentId, setDepartmentId] = useState(userContextInitialState.departmentId);
    const [departmentName, setDepartmentName] = useState(userContextInitialState.departmentName);
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>(userContextInitialState.themeMode);

    function resetUserContext() {
        authHeaders.forEach((value, key) => {
            authHeaders.delete(key);
        }); // to make double sure auth headers get removed after login
        setAuthHeaders(userContextInitialState.authHeaders);
        setIsAuthenticated(userContextInitialState.isAuthenticated);
        setAvailableRoutesList(userContextInitialState.availableRoutesList);
        setUserId(userContextInitialState.userId);
        setFirstName(userContextInitialState.firstName);
        setLastName(userContextInitialState.lastName);
        setIsDroppingReviewer(userContextInitialState.isDroppingReviewer);
        setIsNewTasksAvailable(userContextInitialState.isNewTasksAvailable);
        setIsAdmin(userContextInitialState.isAdmin);
        setIsSuperAdmin(userContextInitialState.isSuperAdmin);
        setIsAdminModeActivated(userContextInitialState.isAdminModeActivated);
        setDepartmentId(userContextInitialState.departmentId);
        setDepartmentName(userContextInitialState.departmentName);
    }

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <title>Inventory Management</title>
                <meta
                    name="viewport"
                    content="initial-scale=1, width=device-width"
                />
            </Head>
            <UserContext.Provider
                value={{
                    authHeaders,
                    setAuthHeaders,
                    isAuthenticated,
                    setIsAuthenticated,
                    availableRoutesList,
                    setAvailableRoutesList,
                    userId,
                    setUserId,
                    firstName,
                    setFirstName,
                    lastName,
                    setLastName,
                    isDroppingReviewer,
                    setIsDroppingReviewer,
                    isNewTasksAvailable,
                    setIsNewTasksAvailable,
                    isAdmin,
                    setIsAdmin,
                    isSuperAdmin,
                    setIsSuperAdmin,
                    isAdminModeActivated,
                    setIsAdminModeActivated,
                    departmentId,
                    setDepartmentId,
                    departmentName,
                    setDepartmentName,
                    themeMode,
                    setThemeMode
                }}
            >
                <ThemeProvider theme={themeMode === 'dark' ? darkTheme : defaultTheme}>
                    <CssBaseline enableColorScheme />
                    <Header resetUserContext={resetUserContext} />
                    <Box
                        display="flex"
                        minHeight="100vh"
                        flexDirection="column"
                        justifyContent="space-between"
                    >
                        {isAuthenticated ? (
                            (departmentId && departmentId !== -1) || isAdmin || isSuperAdmin ? (
                                <Component {...pageProps} />
                            ) : (
                                <Container sx={{ mt: 12, mb: 8 }}>
                                    <CustomAlert
                                        state="warning"
                                        message={
                                            'Du wurdest noch keiner Abteilung zugewiesen und kannst das Inventarverwaltungssystem daher nicht benutzen! Wende dich bitte an einen Administrator!'
                                        }
                                    />
                                </Container>
                            )
                        ) : (
                            <RedirectBoundary children={<LoginForm />} />
                        )}
                        <Footer />
                    </Box>
                </ThemeProvider>
            </UserContext.Provider>
        </CacheProvider>
    );
}
