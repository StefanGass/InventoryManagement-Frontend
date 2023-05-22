import { createContext, useState } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import lightTheme, { darkTheme } from 'styles/theme';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import LoginForm from 'components/forms/LoginForm';
import createEmotionCache from 'utils/createEmotionCache';
import { IUserContext } from 'components/interfaces';
import CustomAlert from 'components/form-fields/CustomAlert';
import { Container } from '@mui/material';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
}

export const UserContext = createContext<IUserContext>({} as IUserContext);

const MyApp = (props: MyAppProps) => {
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

    const [login, setLogin] = useState(false);
    const [userId, setUserId] = useState(-1);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [admin, setAdmin] = useState(false);
    const [superAdmin, setSuperAdmin] = useState(false);
    const [adminMode, setAdminMode] = useState(false);
    const [droppingReviewer, setDroppingReviewer] = useState(false);
    const [showDroppingQueue, setShowDroppingQueue] = useState(false);
    const [departmentId, setDepartmentId] = useState(-1);
    const [departmentName, setDepartmentName] = useState('');
    const [token, setToken] = useState('');
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

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
                    login,
                    setLogin,
                    userId,
                    setUserId,
                    firstName,
                    setFirstName,
                    lastName,
                    setLastName,
                    admin,
                    setAdmin,
                    superAdmin,
                    setSuperAdmin,
                    adminMode,
                    setAdminMode,
                    departmentId,
                    setDepartmentId,
                    departmentName,
                    setDepartmentName,
                    themeMode,
                    setThemeMode,
                    droppingReviewer,
                    setDroppingReviewer,
                    showDroppingQueue,
                    setShowDroppingQueue,
                    token,
                    setToken
                }}
            >
                <ThemeProvider theme={themeMode === 'dark' ? darkTheme : lightTheme}>
                    <CssBaseline enableColorScheme />
                    <Header />
                    <div
                        style={{
                            display: 'flex',
                            minHeight: '100vh',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}
                    >
                        {login ? (
                            (departmentId && departmentId !== -1) || admin || superAdmin ? (
                                <Component {...pageProps} />
                            ) : (
                                <Container sx={{ mt: 12, mb: 8 }}>
                                    <CustomAlert
                                        state="warning"
                                        message={
                                            admin || superAdmin
                                                ? 'Du musst dich zunächst einer Abteilung zuweisen, bevor du die Funktion nutzen kannst!'
                                                : 'Du wurdest noch keiner Abteilung zugewiesen und kannst das Inventarverwaltungssystem daher nicht benutzen! Wende dich bitte an einen Administrator!'
                                        }
                                    />
                                </Container>
                            )
                        ) : (
                            <LoginForm />
                        )}
                        <Footer />
                    </div>
                </ThemeProvider>
            </UserContext.Provider>
        </CacheProvider>
    );
};

export default MyApp;
