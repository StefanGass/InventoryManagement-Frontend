import { FC, useContext, useState } from 'react';
import { IDetailInventoryItem } from 'components/interfaces';
import { Checkbox, Container, FormControlLabel, Grid, Tooltip, Typography } from '@mui/material';
import CustomButton from 'components/form-fields/CustomButton';
import { FlashOff, FlashOn, InfoRounded } from '@mui/icons-material';
import { UserContext } from 'pages/_app';

interface IActivationFormProps {
    inventoryItem: IDetailInventoryItem;
    setActivationMessage: (msg: string) => void;
    setFormError: (msg: string) => void;
    setUpdated: (bool: boolean) => void;
}

const ActivationForm: FC<IActivationFormProps> = ({ inventoryItem, setActivationMessage, setFormError, setUpdated }) => {
    const [deactivateCheck, setDeactivateCheck] = useState(false);
    const { firstName, lastName, admin, superAdmin } = useContext(UserContext);
    const sendDeactivate = () => {
        if (deactivateCheck) {
            fetch(`${process.env.HOSTNAME}/api/inventorymanagement/inventory/${inventoryItem.id}/deactivate`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName: `${firstName} ${lastName}` })
            }).then((response) => {
                if (response.ok) {
                    setActivationMessage('Der Gegenstand wurde deaktiviert.');
                    setUpdated(true);
                } else {
                    response.json().then((res) => setFormError(`Es ist folgender Fehler aufgetreten: ${res.message}`));
                }
            });
        }
    };

    const sendReactivate = () => {
        fetch(`${process.env.HOSTNAME}/api/inventorymanagement/inventory/${inventoryItem.id}/activate`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName: `${firstName} ${lastName}` })
        }).then((response) => {
            if (response.ok) {
                setActivationMessage('Der Gegenstand wurde reaktiviert.');
                setUpdated(true);
            } else {
                response.json().then((res) => setFormError(`Es ist folgender Fehler aufgetreten: ${res.message}`));
            }
        });
    };

    return (
        <>
            {inventoryItem?.active && (
                <>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={deactivateCheck}
                                onChange={(e, checked) => setDeactivateCheck(checked)}
                                sx={{ marginRight: '-0.5em' }}
                            />
                        }
                        label={
                            <Container maxWidth={'sm'}>
                                <Typography>
                                    <strong>Gegenstand deaktivieren:</strong>
                                    <br /> Ich bestätige, dass ich mir bewusst bin, dass ich den Gegenstand nur durch einen Admin reaktivieren lassen kann und
                                    ihn, wenn ich ihn deaktiviere, zum Löschen freigebe.
                                </Typography>
                            </Container>
                        }
                    />
                    <CustomButton
                        onClick={sendDeactivate}
                        label="Deaktivieren"
                        disabled={!deactivateCheck}
                        symbol={<FlashOff />}
                    />
                </>
            )}
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                {!inventoryItem?.active && (
                    <CustomButton
                        onClick={sendReactivate}
                        label="Reaktivieren"
                        disabled={!admin && !superAdmin}
                        symbol={<FlashOn />}
                    />
                )}
                {!inventoryItem?.active && !admin && !superAdmin && (
                    <Tooltip
                        title={'Wenn du den Gegenstand reaktivieren möchtest, musst du dich dazu an einen Admin wenden.'}
                        sx={{ marginTop: '-1em', marginLeft: '-1.5em', marginRight: '0.5em' }}
                    >
                        <InfoRounded color="primary" />
                    </Tooltip>
                )}
            </Grid>
        </>
    );
};

export default ActivationForm;
