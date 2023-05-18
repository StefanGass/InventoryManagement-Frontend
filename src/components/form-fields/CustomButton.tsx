import { FC } from 'react';
import { Button, Grid, Typography } from '@mui/material';

interface ICustomButton {
    onClick: (e?: any) => void;
    label: string;
    symbol?: JSX.Element;
    disabled?: boolean;
}

const CustomButton: FC<ICustomButton> = ({ onClick, label, symbol, disabled }) => {
    return (
        <Grid
            sx={{
                cursor: `${disabled ? 'not-allowed' : 'pointer'}`,
                marginTop: '1em',
                marginBottom: '1em',
                marginRight: '0.5em',
                marginLeft: '0.5em'
            }}
        >
            <Button
                variant="contained"
                data-testid={'btn_'+label}
                id={'btn_'+label}
                onClick={onClick}
                disabled={disabled}
                style={{
                    height: '4em',
                    width: '19.35em'
                }}
            >
                {symbol}
                <Typography>&nbsp;&nbsp;{label}&nbsp;&nbsp;&nbsp;</Typography>
            </Button>
        </Grid>
    );
};

export default CustomButton;
