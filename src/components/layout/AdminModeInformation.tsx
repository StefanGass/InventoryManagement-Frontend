import { useContext } from 'react';
import { Grid, Tooltip } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { UserContext } from '../../../pages/_app';

export default function AdminModeInformation() {
    const { isAdmin, isSuperAdmin, isAdminModeActivated } = useContext(UserContext);

    if (isAdmin || isSuperAdmin) {
        return (
            <Grid
                container
                width="95%"
                margin="auto"
                alignItems="center"
            >
                <Tooltip
                    title="Bitte auf dem Dashboard aktivieren/deaktivieren!"
                    enterDelay={500}
                    followCursor={true}
                >
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isAdminModeActivated}
                                    value={isAdminModeActivated}
                                    disabled={true}
                                />
                            }
                            label={`${isAdminModeActivated ? 'Admin-Modus deaktivieren' : 'Admin-Ansicht aktivieren'}`}
                        />
                    </FormGroup>
                </Tooltip>
            </Grid>
        );
    } else {
        return null;
    }
}
