import { FC, useContext, useState } from 'react';
import { IDetailInventoryItem } from 'components/interfaces';
import { Checkbox, Container, FormControlLabel, Typography } from '@mui/material';
import CustomButton from 'components/form-fields/CustomButton';
import { FlashOff, FlashOn } from '@mui/icons-material';
import { UserContext } from 'pages/_app';

interface IActivationFormProps {
    inventoryItem: IDetailInventoryItem;
    disabled: boolean;
    setActivationMessage: (msg: string) => void;
    setFormError: (msg: string) => void;
    setUpdated: (bool: boolean) => void;
}

const ActivationForm: FC<IActivationFormProps> = ({ inventoryItem, disabled, setActivationMessage, setFormError, setUpdated }) => {
    const [deactivateCheck, setDeactivateCheck] = useState(false);
    const { firstName, lastName } = useContext(UserContext);
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
                                disabled={disabled}
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
            {!inventoryItem?.active && (
                <CustomButton
                    onClick={sendReactivate}
                    label="Reaktivieren"
                    disabled={disabled}
                    symbol={<FlashOn />}
                />
            )}
        </>
    );
};

export default ActivationForm;
