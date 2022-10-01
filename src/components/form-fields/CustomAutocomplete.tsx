import { FC, SyntheticEvent, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { GenericObject } from 'components/interfaces';

interface IAutocomplete {
    options: GenericObject[];
    optionKey: string;
    label: string;
    setValue: (val: string | GenericObject | null) => void;
    error: boolean;
    required?: boolean;
    value?: string;
    disabled?: boolean;
}

const CustomAutocomplete: FC<IAutocomplete> = (props) => {
    const { options, optionKey, label, setValue, error, required = false, value, disabled } = props;
    const [objectValue, setObjectValue] = useState(value ? options.find((option) => option[optionKey] === value) : {});
    const [inputValue, setInputValue] = useState(value ? value : '');

    const defaultProps = {
        options,
        getOptionLabel: (option: GenericObject) => option[optionKey] ?? ''
    };

    useEffect(() => {
        setObjectValue(value ? options.find((option) => option[optionKey] === value) : {});
    }, [value])

    return (
        <Autocomplete
            {...defaultProps}
            disablePortal
            sx={{ m: 1, width: '30ch' }}
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
        />
    );
};

export default CustomAutocomplete;
