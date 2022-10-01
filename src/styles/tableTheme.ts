import { createTheme } from '@mui/material/styles';
import { deDE } from '@mui/x-data-grid';
import theme from 'styles/theme';

export const tableTheme = createTheme(
    {
        palette: {
            primary: { main: theme.palette.primary.main }
        },
        typography: {
            h3: {
                fontSize: '1.25rem',
                fontWeight: 500
            }
        }
    },
    deDE
);
