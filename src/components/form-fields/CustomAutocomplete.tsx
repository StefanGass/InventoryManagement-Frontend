import { FC, SyntheticEvent, useContext, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { GenericObject } from 'components/interfaces';
import { darkGrey, lightGrey } from 'styles/theme';
import { UserContext } from 'pages/_app';

interface IAutocomplete {
    options: GenericObject[];
    optionKey: string;
    label: string;
    setValue: (val: string | GenericObject | null) => void;
    error: boolean;
    required?: boolean;
    value?: string;
    disabled?: boolean;
    suggestDefaultValue?: boolean;
}

const CustomAutocomplete: FC<IAutocomplete> = (props) => {
    const { options, optionKey, label, setValue, error, required = false, value, disabled, suggestDefaultValue } = props;
    const { themeMode } = useContext(UserContext);
    const [objectValue, setObjectValue] = useState(value ? options.find((option) => option[optionKey] === value) : suggestDefaultValue ? options[0] : {});
    const [inputValue, setInputValue] = useState(value ? value : suggestDefaultValue ? options[0][optionKey] : '');

    const defaultProps = {
        options,
        getOptionLabel: (option: GenericObject) => option[optionKey] ?? ''
    };

    useEffect(() => {
        setObjectValue(value ? options.find((option) => option[optionKey] === value) : suggestDefaultValue ? options[0] : {});
    }, [value]);

    return (
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
            disabled={disabled}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    InputLabelProps={{ shrink: true }}
                    error={error}
                    required={required}
                    disabled={disabled}
                />
            )}
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
    );
};

export default CustomAutocomplete;
