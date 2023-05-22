import { FC } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface ISelectProps {
    label: string;
    setValue: (val: number) => void;
    error: boolean;
    admin: boolean;
    superAdmin: boolean;
}

const CustomSelect: FC<ISelectProps> = (props) => {
    const { label, setValue, error, admin, superAdmin } = props;
    const handleChange = (event: SelectChangeEvent) => {
        setValue(Number(event.target.value));
    };

    return (
        <FormControl sx={{ m: 1, width: '30ch' }}>
            <InputLabel
                id="label"
                color="primary"
                error={error}
            >
                {label}
            </InputLabel>
            <Select
                labelId="label"
                label={label}
                onChange={handleChange}
                error={error}
                defaultValue=""
            >
                <MenuItem value={1}>Typ</MenuItem>
                <MenuItem value={2}>Kategorie</MenuItem>
                <MenuItem value={3}>Standort</MenuItem>
                <MenuItem value={4}>Lieferant</MenuItem>
                {(admin || superAdmin) && <MenuItem value={5}>Abteilung</MenuItem>}
                {(superAdmin) && <MenuItem value={6}>Drucker</MenuItem>}
                {(admin || superAdmin) && <MenuItem value={7}>4 Augen Prinzip</MenuItem>}
            </Select>
        </FormControl>
    );
};

export default CustomSelect;
