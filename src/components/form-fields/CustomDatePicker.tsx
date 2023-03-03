import { FC, useContext, useEffect, useState } from 'react';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';
import deLocale from 'date-fns/locale/de';
import { formatISO } from 'date-fns';
import { Clear } from '@mui/icons-material';
import styles from 'styles/DatePicker.module.scss';
import { darkGrey, lightGrey } from 'styles/theme';
import { UserContext } from 'pages/_app';

interface IDatePicker {
    label: string;
    setValue: (val: string) => void;
    error?: boolean;
    value?: string | null;
    disabled?: boolean;
    required?: boolean;
}

const CustomDatePicker: FC<IDatePicker> = (props) => {
    const { label, setValue, error = false, value, disabled, required } = props;
    const { themeMode } = useContext(UserContext);
    const [date, setDate] = useState<Date | null>(value ? new Date(value) : null);

    const onChange = (e) => {
        if (e && !e.cancel) {
            setDate(e);
        }
    };

    const onAccept = () => {
        if (date) {
            const isoFormat = formatISO(date, {representation: 'date'}) + 'T00:00:00Z';
            setValue(isoFormat);
        }
    }

    useEffect(() => {
        if (!value) {
            setDate(null);
        } else {
            setDate(new Date(value));
        }
    }, [value]);

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
                    onAccept={onAccept}
                    disabled={disabled}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            InputLabelProps={{ shrink: true }}
                            error={error}
                            value={date}
                            disabled={disabled}
                            required={required}
                            sx={{
                                m: 1,
                                width: '30ch',
                                '& .MuiInputBase-input.Mui-disabled': {
                                    WebkitTextFillColor: `${themeMode === 'dark' ? lightGrey : darkGrey}`,
                                    '&:hover': {
                                        cursor: 'not-allowed'
                                    }
                                }
                            }}
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
