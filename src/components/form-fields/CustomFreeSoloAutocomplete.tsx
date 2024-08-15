import { SyntheticEvent, useContext } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import defaultTheme, { darkGrey, lightGrey } from 'styles/theme';
import { UserContext } from '../../../pages/_app';
import { Box, useMediaQuery } from '@mui/material';

interface ICustomFreeAutocompleteProps {
    options: string[];
    label: string;
    value: string;
    setValue: (val: string | null) => void;
    isError?: boolean;
    isRequired?: boolean;
    isDisabled?: boolean;
    isDoubleWidth?: boolean;
    isSuggestDefaultValue?: boolean;
}

export default function CustomFreeSoloAutocomplete(props: ICustomFreeAutocompleteProps) {
    const { options, label, value, setValue, isError = false, isRequired = false, isDisabled, isDoubleWidth = false } = props;
    const { themeMode } = useContext(UserContext);
    const matchesPhone = useMediaQuery(defaultTheme.breakpoints.down('sm'));

    return (
        <Box
            component="form" // to remove "Please fill out this form"
            noValidate
            autoComplete="off"
        >
            <Autocomplete
                freeSolo={true}
                options={options?.length > 0 ? options : []}
                disablePortal
                clearOnEscape={true}
                value={value}
                onChange={(event: SyntheticEvent, newValue: string | null) => {
                    if (newValue) {
                        setValue(newValue);
                    } else if (newValue === null) {
                        setValue('');
                    }
                }}
                inputValue={value}
                onInputChange={(event, val) => {
                    setValue(val);
                }}
                disableClearable={value === ''}
                disabled={isDisabled}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        InputLabelProps={{ shrink: true }}
                        error={isError}
                        required={isRequired}
                        disabled={isDisabled}
                        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                        sx={{
                            m: 1,
                            width: isDoubleWidth && !matchesPhone ? 'calc(2 * 30ch + 16px)' : '30ch',
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
                )}
            />
        </Box>
    );
}
