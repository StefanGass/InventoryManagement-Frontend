import { useContext } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { GenericObject } from 'components/interfaces';
import { darkGrey, lightGrey } from 'styles/theme';
import { UserContext } from '../../../pages/_app';

interface ICustomTextFieldProps {
    label: string;
    setValue: (string: string) => void;
    isError?: boolean;
    isMultiline?: boolean;
    isRequired?: boolean;
    value?: string | GenericObject | number | null;
    helperText?: string;
    isDisabled?: boolean;
    type?: string;
}

export default function CustomTextField(props: ICustomTextFieldProps) {
    const { label, setValue, isError = false, isMultiline = false, isRequired = false, value, helperText = null, isDisabled, type = 'string' } = props;
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
                onChange={(e) => setValue(e.target.value)}
                error={isError}
                minRows={isMultiline ? 4 : 1}
                multiline={isMultiline}
                required={isRequired}
                helperText={helperText}
                disabled={isDisabled}
                onKeyDown={(e) => !isMultiline && e.key === 'Enter' && e.preventDefault()}
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
}
