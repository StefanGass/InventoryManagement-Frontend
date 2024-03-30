import { SyntheticEvent, useContext, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { GenericObject } from 'components/interfaces';
import { darkGrey, lightGrey } from 'styles/theme';
import { UserContext } from '../../../pages/_app';
import { Box } from '@mui/material';

interface ICustomAutocompleteProps {
    options: GenericObject[];
    optionKey: string;
    label: string;
    setValue: (val: string | GenericObject | null) => void;
    isError: boolean;
    isRequired?: boolean;
    value?: string;
    isDisabled?: boolean;
    isSuggestDefaultValue?: boolean;
}

export default function CustomAutocomplete(props: ICustomAutocompleteProps) {
    const { options, optionKey, label, setValue, isError, isRequired = false, value, isDisabled, isSuggestDefaultValue } = props;
    const { themeMode } = useContext(UserContext);
    const [objectValue, setObjectValue] = useState(value ? options.find((option) => option[optionKey] === value) : isSuggestDefaultValue ? options[0] : {});
    const [inputValue, setInputValue] = useState(value ? value : isSuggestDefaultValue ? options[0][optionKey] : '');

    const defaultProps = {
        options,
        getOptionLabel: (option: GenericObject) => option[optionKey] ?? ''
    };

    useEffect(() => {
        setObjectValue(value ? options.find((option) => option[optionKey] === value) : isSuggestDefaultValue ? options[0] : {});
    }, [value]);

    return (
        <Box
            component="form" // to remove "Please fill out this form"
            noValidate
        >
            <Autocomplete
                {...defaultProps}
                disablePortal
                autoComplete={true}
                autoSelect={true}
                clearOnEscape={true}
                onChange={(event: SyntheticEvent, newValue: GenericObject | null) => {
                    if (newValue) {
                        setValue(newValue);
                        setObjectValue(newValue);
                    } else if (newValue === null) {
                        setValue(null);
                        setObjectValue({});
                    }
                }}
                inputValue={inputValue}
                onInputChange={(event, val) => {
                    setInputValue(val);
                }}
                value={objectValue}
                noOptionsText="Keine Treffer"
                isOptionEqualToValue={(option, value) => option.value === value?.value}
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
                        sx={{
                            m: 1,
                            width: '30ch',
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
