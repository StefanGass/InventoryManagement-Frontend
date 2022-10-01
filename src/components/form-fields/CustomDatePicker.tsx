import { FC, useState } from 'react';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';
import deLocale from 'date-fns/locale/de';
import { formatISO } from 'date-fns';
import { Clear } from '@mui/icons-material';
import styles from 'styles/DatePicker.module.scss';

interface IDatePicker {
    label: string;
    setValue: (val: string) => void;
    error?: boolean;
    value?: string | null;
    disabled?: boolean;
}

const CustomDatePicker: FC<IDatePicker> = (props) => {
    const { label, setValue, error = false, value, disabled } = props;
    const [date, setDate] = useState<Date | null>(value ? new Date(value) : null);

    const onChange = (e) => {
        const isoFormat = formatISO(e, { representation: 'date' }) + 'T00:00:00Z';
        setValue(isoFormat);
        setDate(e);
    };

    return (
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={deLocale}
        >
            <div className={styles.wrapper}>
                <MobileDatePicker
                    label={label}
                    inputFormat="dd/MM/yyyy"
                    value={date}
                    onChange={onChange}
                    disabled={disabled}
                    renderInput={(params) => (
                        <TextField
                            sx={{ m: 1, width: '30ch' }}
                            {...params}
                            InputLabelProps={{ shrink: true }}
                            error={error}
                            value={date}
                            disabled={disabled}
                        />
                    )}
                />
                {!disabled && date && (
                    <Clear
                        className={styles.cancel}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDate(null);
                            setValue('');
                        }}
                    />
                )}
            </div>
        </LocalizationProvider>
    );
};

export default CustomDatePicker;
