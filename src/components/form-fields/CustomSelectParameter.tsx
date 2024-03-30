import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useContext } from 'react';
import { UserContext } from '../../../pages/_app';

interface ICustomSelectParameterProps {
    label: string;
    value: string;
    setValue: (val: string) => void;
    isError: boolean;
}

export default function CustomSelectParameter(props: ICustomSelectParameterProps) {
    const { label, value, setValue, isError } = props;
    const { isAdmin, isSuperAdmin } = useContext(UserContext);

    function handleChange(event: SelectChangeEvent) {
        setValue(event.target.value);
    }

    return (
        <FormControl sx={{ m: 1, width: '30ch' }}>
            <InputLabel
                id="label"
                color="primary"
                error={isError}
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
                <MenuItem value="type">Typ</MenuItem>
                <MenuItem value="category">Kategorie</MenuItem>
                <MenuItem value="location">Standort</MenuItem>
                <MenuItem value="supplier">Lieferant</MenuItem>
                {(isAdmin || isSuperAdmin) && <MenuItem value="department">Abteilung</MenuItem>}
                {(isAdmin || isSuperAdmin) && <MenuItem value="departmentMember">Abteilungsmitglieder</MenuItem>}
                {(isAdmin || isSuperAdmin) && <MenuItem value="droppingReviewer">4-Augen-Prinzip</MenuItem>}
                {(isAdmin || isSuperAdmin) && <MenuItem value="printer">Drucker</MenuItem>}
            </Select>
        </FormControl>
    );
}
