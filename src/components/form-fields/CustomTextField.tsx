import { FC } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { GenericObject } from 'components/interfaces';

interface ITextField {
    label: string;
    setValue: (string: string) => void;
    error?: boolean;
    multiline?: boolean;
    required?: boolean;
    value?: string | GenericObject | number | null;
    disabled?: boolean;
    type?: string;
}

const CustomTextField: FC<ITextField> = (props) => {
    const { label, setValue, error = false, multiline = false, required = false, value, disabled, type = 'string' } = props;

    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '30ch' }
            }}
            noValidate
            autoComplete="off"
        >
            <TextField
                label={label}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                error={error}
                minRows={multiline ? 4 : 1}
                multiline={multiline}
                required={required}
                disabled={disabled}
                onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                type={type}
            />
        </Box>
    );
};

export default CustomTextField;
