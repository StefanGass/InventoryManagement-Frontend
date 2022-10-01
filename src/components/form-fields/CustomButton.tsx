import { FC } from 'react';
import { Button, Typography } from '@mui/material';
import theme from 'styles/theme';

interface ICustomButton {
    onClick: (e?: any) => void;
    label: string;
    symbol?: JSX.Element;
    disabled?: boolean;
}

const CustomButton: FC<ICustomButton> = ({ onClick, label, symbol, disabled }) => {
    return (
        <Button
            variant="contained"
            onClick={onClick}
            style={{
                color: theme.palette.secondary.main,
                height: '4em',
                width: '19.35em',
                marginTop: '1em',
                marginBottom: '1em',
                marginRight: '0.5em',
                marginLeft: '0.5em'
            }}
            disabled={disabled}
        >
            {symbol}
            <Typography>&nbsp;&nbsp;{label}&nbsp;&nbsp;&nbsp;</Typography>
        </Button>
    );
};

export default CustomButton;
