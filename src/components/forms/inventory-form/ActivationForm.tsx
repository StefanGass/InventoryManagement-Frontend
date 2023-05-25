import { FC, useContext, useState } from 'react';
import { IDetailInventoryItem } from 'components/interfaces';
import { Checkbox, Container, FormControlLabel, Grid, Tooltip, Typography } from '@mui/material';
import CustomButton from 'components/form-fields/CustomButton';
import { FlashOff, FlashOn, InfoRounded } from '@mui/icons-material';
import { UserContext } from 'pages/_app';
import inventoryManagementService from "service/inventoryManagementService";
import { DEAKTIVIEREN, DroppingActivationUtil } from "utils/droppingActivationUtil";
import { CustomTooltip } from "components/form-fields/CustomTooltip";

interface IActivationFormProps {
    inventoryItem: IDetailInventoryItem;
    setActivationMessage: (msg: string) => void;
    setFormError: (msg: string) => void;
    setUpdated: (bool: boolean) => void;
    onFormSent: (...params) => void;
}

const ActivationForm: FC<IActivationFormProps> = ({ inventoryItem, setActivationMessage, setFormError, setUpdated, onFormSent }) => {
    const [deactivateCheck, setDeactivateCheck] = useState(false);
    const { firstName, lastName, admin, superAdmin, userId } = useContext(UserContext);
    const sendDeactivateRequest = () => {
        if (inventoryItem.id) {
            onFormSent({
                ...inventoryItem,
                droppingQueue:DEAKTIVIEREN,
                droppingQueueRequester:String(userId)
            });
        }
    };
    const sendDeactivate= (approved:boolean) => {
        let request;
        let body = {userName:`${firstName} ${lastName}`};
        if (deactivateCheck && inventoryItem.id && approved) {
            request= inventoryManagementService.deactivateInventoryItem(inventoryItem.id,body);
        }else if (inventoryItem.id && !approved){
            const form = {
                ...inventoryItem
            }
            DroppingActivationUtil.unsetDroppingProperties(form);
            onFormSent(form);
        }
        if(request){
            request.then((response) => {
                if (response.ok) {
                    setActivationMessage(approved?'Der Gegenstand wurde deaktiviert.':'Der Gegenstand bleibt aktiv.');
                    setUpdated(true);
                } else {
                    response.json().then((res) => setFormError(`Es ist folgender Fehler aufgetreten: ${res.message}`));
                }
            });
        }
    };

    const sendReactivate = () => {
        if(inventoryItem?.id){
            inventoryManagementService.reactivateInventoryItem(inventoryItem.id,{ userName: `${firstName} ${lastName}` })
                .then((response) => {
                    if (response.ok) {
                        setActivationMessage('Der Gegenstand wurde reaktiviert.');
                        setUpdated(true);
                    } else {
                        response.json().then((res) => setFormError(`Es ist folgender Fehler aufgetreten: ${res.message}`));
                    }
                });
        }
    };

    return (
        <>
            {inventoryItem?.active && DroppingActivationUtil.isDeaktivieren(inventoryItem) && (
                <>
                {inventoryItem.droppingQueueRequester !== userId?(
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={deactivateCheck}
                                id="deaktivierenCheckbox"
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
                ) : (
                    <Typography>
                        <strong>Deaktivierung wurde angefordert.</strong>
                    </Typography>
                )}
                    {inventoryItem.droppingQueueRequester !== userId &&

                        <div style={{ display: "flex" }}>
                            <CustomButton
                                onClick={() => sendDeactivate(true)}
                                label="Deaktivieren bestätigen"
                                id="bestaetigenButton"
                                disabled={!deactivateCheck}
                                symbol={<FlashOff />}
                            />
                            <CustomButton
                                onClick={() => sendDeactivate(false)}
                                label="Deaktivieren ablehnen"
                                id="ablehnenButton"
                                symbol={<FlashOn />}
                            />
                        </div>
                    }
                </>
            )}
            {inventoryItem?.active && !DroppingActivationUtil.isDeaktivieren(inventoryItem) && (
                <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                >
                    <CustomButton
                        onClick={sendDeactivateRequest}
                        label="Deaktivieren anfordern"
                        symbol={<FlashOff />}
                        disabled={!!inventoryItem?.droppingQueue}
                    />
                    {DroppingActivationUtil.isAusscheiden(inventoryItem) &&(
                        <CustomTooltip title={'Ausscheiden wurde angefordert.'}/>
                    )}
                </Grid>
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
                        id="reaktivierenButton"
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
