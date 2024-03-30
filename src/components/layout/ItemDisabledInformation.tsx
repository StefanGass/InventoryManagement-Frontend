import React, { useContext } from 'react';
import { Grid, Typography } from '@mui/material';
import defaultTheme, { darkTheme } from 'styles/theme';
import { UserContext } from '../../../pages/_app';

interface IItemDisabledInformationProps {
    headingText: string;
    infoText?: string;
    symbol: React.JSX.Element;
}

export default function ItemDisabledInformation(props: IItemDisabledInformationProps) {
    const { headingText, infoText, symbol } = props;
    const { themeMode } = useContext(UserContext);
    return (
        <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ color: themeMode === 'dark' ? darkTheme.palette.error.main : defaultTheme.palette.error.main }}
        >
            {symbol}
            <Grid
                marginLeft="8px"
                marginRight="8px"
            >
                <Typography
                    fontSize="2.25rem"
                    fontWeight={500}
                    textAlign="center"
                >
                    <strong>{headingText}</strong>
                </Typography>
                {infoText && (
                    <Typography
                        textAlign="center"
                        sx={{ marginTop: '-10px' }}
                    >
                        {infoText}
                    </Typography>
                )}
            </Grid>
            {symbol}
        </Grid>
    );
}
