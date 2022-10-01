import { createContext, useState } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';

import theme from 'styles/theme';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import LoginForm from 'components/forms/LoginForm';
import createEmotionCache from 'utils/createEmotionCache';
import NoDepartmentErrorAlert from 'components/alerts/NoDepartmentErrorAlert';
import { IUserContext } from 'components/interfaces';

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
    const [departmentId, setDepartmentId] = useState(-1);
    const [departmentName, setDepartmentName] = useState('');
    const [superAdmin, setSuperAdmin] = useState(false);

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
                    departmentId,
                    setDepartmentId,
                    superAdmin,
                    setSuperAdmin,
                    setDepartmentName,
                    departmentName
                }}
            >
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Header
                        login={login}
                        setLogin={setLogin}
                    />
                    <div
                        style={{
                            display: 'flex',
                            minHeight: '100vh',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}
                    >
                        {login ? departmentId !== -1 || superAdmin ? <Component {...pageProps} /> : <NoDepartmentErrorAlert /> : <LoginForm />}
                        <Footer />
                    </div>
                </ThemeProvider>
            </UserContext.Provider>
        </CacheProvider>
    );
};

export default MyApp;
