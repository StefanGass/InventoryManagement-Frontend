import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import styles from 'styles/Select.module.scss';
import { Clear } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useContext } from 'react';
import { UserContext } from '../../../pages/_app';
import defaultTheme, { darkTheme } from 'styles/theme';

interface ICustomSelectStatusProps {
    label: string;
    menuItemList: string[];
    value: string;
    setValue: (val: string) => void;
    isError?: boolean;
}

export default function CustomSelectStatus(props: ICustomSelectStatusProps) {
    const { label, menuItemList, value, setValue, isError } = props;
    const { themeMode } = useContext(UserContext);

    function handleChange(event: SelectChangeEvent) {
        setValue(event.target.value);
    }

    return (
        <Box className={styles.wrapper}>
            <FormControl sx={{ m: 1, width: '30ch' }}>
                <InputLabel
                    id="label"
                    color="primary"
                    shrink={true}
                    error={isError}
                    sx={{ // shrink does not provide a background - probably a MUI bug
                        background: themeMode === 'dark' ? darkTheme.palette.background.default : defaultTheme.palette.background.default,
                        marginLeft: '-5px',
                        paddingX: '5px'
                    }}
                >
                    {label}
                </InputLabel>
                <Select
                    labelId="label"
                    label={label}
                    value={value}
                    onChange={handleChange}
                    error={isError}
                    defaultValue=""
                >
                    {menuItemList.map((item) => (
                        <MenuItem key={item} value={item}>{item}</MenuItem>
                    ))}
                </Select>
                {value && (
                    <Clear
                        className={styles.cancel}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setValue('');
                        }}
                    />
                )}
            </FormControl>
        </Box>
    );
}
