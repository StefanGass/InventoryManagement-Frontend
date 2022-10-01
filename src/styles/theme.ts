import { createTheme } from '@mui/material/styles';

export const mainRed = '#800000';
export const mainBlack = '#212121';
export const mainWhite = '#fafafa';
export const mainGold = '#FFD700';
export const errorRed = '#DC143C';
export const lightGrey = '#bdbdbd';
export const darkGrey = '#616161';

const theme = createTheme({
    palette: {
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
        h1: {
            fontSize: '2.25rem',
            fontWeight: 500
        },
        h2: {
            fontSize: '1.5rem',
            fontWeight: 500
        },
        h3: {
            fontSize: '1.25rem',
            fontWeight: 500
        }
    }
});

export default theme;
