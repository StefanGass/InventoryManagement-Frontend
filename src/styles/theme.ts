import { createTheme } from '@mui/material/styles';
import { deDE } from '@mui/x-data-grid';

export const mainRed = '#800000';
export const mainBlack = '#212121';
export const mainWhite = '#fafafa';
export const mainGold = '#FFD700';
export const errorRed = '#DC143C';
export const lightGrey = '#bdbdbd';
export const darkGrey = '#616161';
export const defaultInfoBlue = '#0288d1';
export const darkBackground = '#212121';

export const darkTheme = createTheme(
    {
        palette: {
            mode: 'dark',
            common: {
                black: mainBlack,
                white: mainWhite
            },
            primary: {
                main: mainRed
            },
            secondary: {
                main: mainBlack
            },
            info: {
                main: mainGold
            },
            error: {
                main: errorRed
            },
            background: {
                default: darkBackground,
                paper: darkBackground
            }
        },
        typography: {
            fontFamily: 'Roboto-Regular',
            h1: {
                fontFamily: 'Roboto-Medium',
                fontSize: '2.25rem',
                fontWeight: 500
            },
            h2: {
                fontFamily: 'Roboto-Medium',
                fontSize: '1.5rem',
                fontWeight: 500
            },
            h3: {
                fontFamily: 'Roboto-Medium',
                fontSize: '1.25rem',
                fontWeight: 500
            }
        }
    },
    deDE
);

const lightTheme = createTheme(
    {
        palette: {
            mode: 'light',
            common: {
                black: mainBlack,
                white: mainWhite
            },
            primary: {
                main: mainRed
            },
            secondary: {
                main: mainWhite
            },
            info: {
                main: mainGold
            },
            error: {
                main: errorRed
            }
        },
        typography: {
            fontFamily: 'Roboto-Regular',
            h1: {
                fontFamily: 'Roboto-Medium',
                fontSize: '2.25rem',
                fontWeight: 500
            },
            h2: {
                fontFamily: 'Roboto-Medium',
                fontSize: '1.5rem',
                fontWeight: 500
            },
            h3: {
                fontFamily: 'Roboto-Medium',
                fontSize: '1.25rem',
                fontWeight: 500
            }
        }
    },
    deDE
);

export default lightTheme;
