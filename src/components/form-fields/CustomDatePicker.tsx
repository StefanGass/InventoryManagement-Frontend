import { useContext, useEffect, useState } from 'react';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import deLocale from 'date-fns/locale/de';
import { formatISO } from 'date-fns';
import { Clear } from '@mui/icons-material';
import styles from 'styles/DatePicker.module.scss';
import { darkGrey, lightGrey } from 'styles/theme';
import { UserContext } from '../../../pages/_app';
import { Box } from '@mui/material';

interface ICustomDatePickerProps {
    label: string;
    setValue: (val: string) => void;
    isError?: boolean;
    value?: string | null;
    isDisplayWeekNumber?: boolean;
    isDisabled?: boolean;
    isRequired?: boolean;
    isDisableFuture?: boolean;
    minDate?: string;
    maxDate?: string;
}

export default function CustomDatePicker(props: ICustomDatePickerProps) {
    const { label, setValue, isError = false, value, isDisplayWeekNumber = false, isDisabled, isRequired, isDisableFuture = false, minDate, maxDate} = props;
    const { themeMode } = useContext(UserContext);
    const [date, setDate] = useState<Date | null>(value ? new Date(value) : null);

    function onChange(e) {
        if (e && !e.cancel) {
            setDate(e);
        }
    }

    function onAccept() {
        if (date) {
            const isoFormat = formatISO(date, { representation: 'date' }) + 'T00:00:00Z';
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
            <Box className={styles.wrapper}>
                <MobileDatePicker
                    label={label}
                    format="dd/MM/yyyy"
                    value={date}
                    onChange={onChange}
                    onAccept={onAccept}
                    displayWeekNumber={isDisplayWeekNumber}
                    disabled={isDisabled}
                    disableFuture={isDisableFuture}
                    minDate={minDate ? (new Date(minDate)) : undefined}
                    maxDate={maxDate ? (new Date(maxDate)) : undefined}
                    slotProps={{
                        textField: {
                            error: isError,
                            value: date,
                            placeholder: '',
                            disabled: isDisabled,
                            required: isRequired,
                            InputLabelProps: { shrink: true },
                            sx: {
                                m: 1,
                                width: '30ch',
                                '& .MuiInputBase-input.Mui-disabled': {
                                    WebkitTextFillColor: `${themeMode === 'dark' ? lightGrey : darkGrey}`,
                                    '&:hover': {
                                        cursor: 'not-allowed'
                                    }
                                }
                            }
                        }
                    }}
                />
                {!isDisabled && date && (
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
            </Box>
        </LocalizationProvider>
    );
}
