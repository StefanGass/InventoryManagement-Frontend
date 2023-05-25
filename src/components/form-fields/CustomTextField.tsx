import { FC, useContext } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { GenericObject } from 'components/interfaces';
import { darkGrey, lightGrey } from 'styles/theme';
import { UserContext } from 'pages/_app';

interface ITextField {
    label: string;
    setValue: (string: string) => void;
    error?: boolean;
    multiline?: boolean;
    required?: boolean;
    value?: string | GenericObject | number | null;
    helperText?: string;
    disabled?: boolean;
    type?: string;
    id?:string;
}

const CustomTextField: FC<ITextField> = (props) => {
    const { label, setValue, error = false, multiline = false, required = false, value, helperText = null, disabled, type = 'string',id } = props;
    const { themeMode } = useContext(UserContext);

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
                id={id}
                onChange={(e) => setValue(e.target.value)}
                error={error}
                minRows={multiline ? 4 : 1}
                multiline={multiline}
                required={required}
                helperText={helperText}
                disabled={disabled}
                onKeyDown={(e) => !multiline && e.key === 'Enter' && e.preventDefault()}
                type={type}
                sx={{
                    '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: `${themeMode === 'dark' ? lightGrey : darkGrey}`,
                        '&:hover': {
                            cursor: 'not-allowed'
                        }
                    },
                    '& .MuiInputBase-root.Mui-disabled': {
                        WebkitTextFillColor: `${themeMode === 'dark' ? lightGrey : darkGrey}`,
                        '&:hover': {
                            cursor: 'not-allowed'
                        }
                    }
                }}
            />
        </Box>
    );
};

export default CustomTextField;
