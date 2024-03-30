import { createTheme } from '@mui/material/styles';
import { deDE as deDEDataGrid } from '@mui/x-data-grid';
import { deDE as deDEDatePicker } from '@mui/x-date-pickers/locales';

export const mainRed = '#A63321';
export const mainOrangeRed = '#D85A3B';
export const mainOrange = '#EBA93B';
export const mainGold = '#F7CE46';
export const mainYellow = '#FAE058';
export const mainBlack = '#212121';
export const mainWhite = '#FAFAFA';
export const errorRed = '#DC143C';
export const lightGrey = '#B5AFAF';
export const darkGrey = '#635C5B';
export const whiteBackground = '#F9FBFF';
export const darkBackground = '#212121';

export const RAINBOW_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF00FF', '#FF8042', '#DC143C', '#9400D3', '#008000'];

const defaultTheme = createTheme(
    {
        palette: {
            common: {
                black: mainBlack,
                white: mainWhite
            },
            primary: {
                main: mainRed
            },
            secondary: {
                main: mainGold
            },
            error: {
                main: errorRed
            },
            background: {
                paper: whiteBackground
            }
        },
        typography: {
            fontFamily: 'Roboto-Regular',
            h1: {
                fontFamily: 'Roboto-Bold',
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
            },
            button: {
                textTransform: 'none'
            }
        }
    },
    deDEDataGrid,
    deDEDatePicker
);

export const darkTheme = createTheme(
    {
        ...defaultTheme,
        palette: {
            mode: 'dark',
            common: {
                black: mainBlack,
                white: mainWhite
            },
            primary: {
                main: mainOrange
            },
            secondary: {
                main: mainOrangeRed
            },
            error: {
                main: errorRed
            },
            background: {
                paper: darkBackground
            }
        }
    },
    deDEDataGrid,
    deDEDatePicker
);

export default defaultTheme;
