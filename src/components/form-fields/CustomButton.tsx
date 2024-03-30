import React, { useContext } from 'react';
import { Button, ButtonPropsColorOverrides, Grid, Typography } from '@mui/material';
import { OverridableStringUnion } from '@mui/types';
import { darkGrey, lightGrey } from 'styles/theme';
import { UserContext } from '../../../pages/_app';

interface ICustomButtonProps {
    keyString?: string;
    label: string;
    symbol?: React.JSX.Element;
    color?: OverridableStringUnion<'primary' | 'inherit' | 'secondary' | 'success' | 'error' | 'info' | 'warning', ButtonPropsColorOverrides> | undefined;
    onClick: (e?: any) => void;
    isDoubleHeight?: boolean;
    isDisabled?: boolean;
}

export default function CustomButton(props: ICustomButtonProps) {
    const { keyString, label, symbol, color = 'primary', onClick, isDoubleHeight = false, isDisabled } = props;
    const { themeMode } = useContext(UserContext);
    return (
        <Grid
            sx={{
                cursor: `${isDisabled ? 'not-allowed' : 'pointer'}`,
                marginTop: '1em',
                marginBottom: '1em',
                marginRight: '1em',
                marginLeft: '1em'
            }}
        >
            <Button
                key={keyString} // to disable react warnings
                variant="contained"
                onClick={onClick}
                disabled={isDisabled}
                color={color}
                sx={{
                    height: isDoubleHeight ? '8em' : '4em',
                    width: '19.35em',
                    border: color === 'inherit' ? `0.5px solid ${themeMode === 'dark' ? darkGrey : lightGrey}` : null
                }}
            >
                {symbol}
                <Typography
                    fontSize={isDoubleHeight ? '1.5rem' : '1rem'}
                    fontWeight={isDoubleHeight ? 'bold' : 'normal'}
                    sx={{ marginRight: '0.5em', marginLeft: '0.5em' }}
                >
                    {label}
                </Typography>
            </Button>
        </Grid>
    );
}
