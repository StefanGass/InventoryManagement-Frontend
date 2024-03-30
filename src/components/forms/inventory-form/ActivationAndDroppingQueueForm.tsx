import { useContext, useState } from 'react';
import { IDetailInventoryItem } from 'components/interfaces';
import { Box, Checkbox, Container, FormControlLabel, Grid, keyframes, Tooltip, Typography } from '@mui/material';
import CustomButton from 'components/form-fields/CustomButton';
import { Cancel, DeleteForever, FlashOff, FlashOn } from '@mui/icons-material';
import { UserContext } from '../../../../pages/_app';
import inventoryManagementService from 'service/inventoryManagementService';
import { DEAKTIVIEREN, DroppingActivationUtil } from 'utils/droppingActivationUtil';
import { formatISO } from 'date-fns';
import CustomTextField from 'components/form-fields/CustomTextField';

interface IActivationAndDroppingQueueFormProps {
    inventoryItem: IDetailInventoryItem;
    setActivationMessage: (msg: string) => void;
    setUpdated: (bool: boolean) => void;
    onFormSent: (...params) => void;
    handleError: (msg: string) => void;
}

const blink = keyframes`
    from {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
    to {
        transform: scale(1);
    }
`;

export default function ActivationAndDroppingQueueForm(props: IActivationAndDroppingQueueFormProps) {
    const { inventoryItem, setActivationMessage, setUpdated, onFormSent, handleError } = props;
    const { firstName, lastName, userId, isDroppingReviewer, isAdmin, isSuperAdmin, isAdminModeActivated } = useContext(UserContext);
    const [isDeactivateCheck, setIsDeactivateCheck] = useState(false);

    function sendDeactivateRequest() {
        setActivationMessage('Die Deaktivierung wurde erfolgreich angefordert.');
        if (inventoryItem.id) {
            onFormSent({
                ...inventoryItem,
                pictures: undefined,
                droppingQueue: DEAKTIVIEREN,
                droppingQueuePieces: inventoryItem.pieces,
                droppingQueueReason: 'Irrtümlicherweise angelegt',
                droppingQueueDate: new Date(), // will be overwritten in backend
                droppingQueueRequester: userId
            });
        }
    }

    function sendDrop(isApproved: boolean) {
        if (inventoryItem.id && isApproved) {
            const isoFormatDate = inventoryItem.droppingQueueDate ? formatISO(new Date(inventoryItem.droppingQueueDate), { representation: 'date' }) : '';
            const isoFormatDateTime = isoFormatDate + 'T00:00:00Z';
            if (inventoryItem.droppingQueueReason) {
                inventoryItem.droppingQueueReason.trim();
            }
            setActivationMessage('Der Gegenstand wurde erfolgreich ausgeschieden.');
            if (inventoryItem.id && inventoryItem.droppingQueuePieces) {
                let tmpDroppingReason: string | undefined;
                if (inventoryItem.pieces === 1) {
                    tmpDroppingReason = inventoryItem.droppingQueueReason;
                } else {
                    tmpDroppingReason =
                        `${isoFormatDate} ~ ${inventoryItem.droppingQueuePieces} Stk. ~ ${inventoryItem.droppingQueueReason}\n` + inventoryItem.droppingReason;
                }
                const form: IDetailInventoryItem = {
                    ...inventoryItem,
                    pictures: undefined,
                    piecesDropped: inventoryItem.droppingQueuePieces + inventoryItem.piecesDropped,
                    piecesStored: inventoryItem.piecesStored - inventoryItem.droppingQueuePieces,
                    droppingReason: tmpDroppingReason,
                    droppingDate: isoFormatDateTime,
                    userName: `${firstName} ${lastName}`
                };
                DroppingActivationUtil.unsetDroppingProperties(form);
                onFormSent(form);
            }
        } else if (inventoryItem.id && !isApproved) {
            setActivationMessage('Die Ausscheidung wurde abgelehnt, der Gegenstand bleibt somit aktiv.');
            const form: IDetailInventoryItem = {
                ...inventoryItem,
                pictures: undefined
            };
            DroppingActivationUtil.unsetDroppingProperties(form);
            onFormSent(form);
        }
    }

    function sendDeactivate(isApproved: boolean) {
        let body = { ...inventoryItem, userName: `${firstName} ${lastName}` };
        if (inventoryItem.id && isApproved) {
            inventoryManagementService
                .deactivateInventoryItem(inventoryItem.id, body)
                .then((response) => {
                    if (response.ok) {
                        setActivationMessage('Der Gegenstand wurde erfolgreich deaktiviert.');
                        setUpdated(true);
                    } else {
                        response
                            .json()
                            .then(() => handleError('Der Gegenstand konnte nicht deaktiviert werden! Probiere es erneut oder kontaktiere die IT für Hilfe.'));
                    }
                })
                .catch(() => handleError('Der Gegenstand konnte nicht deaktiviert werden! Probiere es erneut oder kontaktiere die IT für Hilfe.'));
        } else if (inventoryItem.id && !isApproved) {
            setActivationMessage('Die Deaktivierung wurde abgelehnt, der Gegenstand bleibt somit aktiv.');
            const form: IDetailInventoryItem = {
                ...inventoryItem,
                pictures: undefined
            };
            DroppingActivationUtil.unsetDroppingProperties(form);
            onFormSent(form);
        }
    }

    function sendReactivate() {
        if (inventoryItem?.id) {
            inventoryManagementService
                .reactivateInventoryItem(inventoryItem.id, { userName: `${firstName} ${lastName}` })
                .then((response) => {
                    if (response.ok) {
                        setActivationMessage('Der Gegenstand wurde erfolgreich reaktiviert.');
                        setUpdated(true);
                    } else {
                        response
                            .json()
                            .then(() => handleError('Der Gegenstand konnte nicht reaktiviert werden! Probiere es erneut oder kontaktiere die IT für Hilfe.'));
                    }
                })
                .catch(() => handleError('Der Gegenstand konnte nicht reaktiviert werden! Probiere es erneut oder kontaktiere die IT für Hilfe.'));
        }
    }

    function revokeDroppingQueue() {
        if (inventoryItem?.id) {
            inventoryManagementService
                .revokeDroppingInventoryItem(inventoryItem.id, { userName: `${firstName} ${lastName}` })
                .then((response) => {
                    if (response.ok) {
                        response
                            .json()
                            .then((result: boolean) => {
                                if (result) {
                                    setActivationMessage('Der Vorgang wurde erfolgreich abgebrochen.');
                                    setUpdated(true);
                                } else {
                                    handleError('Der Vorgang konnte nicht abgebrochen werden! Probiere es erneut oder kontaktiere die IT für Hilfe.');
                                }
                            })
                            .catch(() => handleError('Der Vorgang konnte nicht abgebrochen werden! Probiere es erneut oder kontaktiere die IT für Hilfe.'));
                    } else {
                        response
                            .json()
                            .then(() => handleError('Der Vorgang konnte nicht abgebrochen werden! Probiere es erneut oder kontaktiere die IT für Hilfe.'));
                    }
                })
                .catch(() => handleError('Der Vorgang konnte nicht abgebrochen werden! Probiere es erneut oder kontaktiere die IT für Hilfe.'));
        }
    }

    function droppingInfo() {
        return (
            <>
                <Typography textAlign="center">
                    <strong>
                        {inventoryItem.droppingQueuePieces !== inventoryItem.pieces
                            ? 'Die Ausscheidung einer Teilmenge des Gegenstands wurde angefordert:'
                            : 'Die Ausscheidung des Gegenstands wurde angefordert:'}
                    </strong>
                </Typography>
                <Box my={0.5} />
                <Grid
                    container
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                >
                    <CustomTextField
                        label="Stückzahl auszuscheiden"
                        value={inventoryItem.droppingQueuePieces}
                        setValue={() => {}}
                        isDisabled={true}
                    />
                    <CustomTextField
                        label="Ausscheidedatum"
                        value={new Date(inventoryItem.droppingQueueDate ? inventoryItem.droppingQueueDate : '').toLocaleDateString('en-CA', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        })}
                        setValue={() => {}}
                        isDisabled={true}
                    />
                    <CustomTextField
                        label="Ausscheidegrund"
                        value={inventoryItem.droppingQueueReason}
                        setValue={() => {}}
                        isDisabled={true}
                    />
                </Grid>
                <Box my={0.5} />
            </>
        );
    }

    return (
        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
        >
            {inventoryItem?.active ? (
                !DroppingActivationUtil.isDrop(inventoryItem) && !DroppingActivationUtil.isDeactivate(inventoryItem) ? (
                    <>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isDeactivateCheck}
                                    onChange={(e, checked) => setIsDeactivateCheck(checked)}
                                    sx={{ marginRight: '-0.5em' }}
                                />
                            }
                            label={
                                <Container maxWidth="sm">
                                    <Typography>
                                        <strong>Gegenstand deaktivieren:</strong>
                                        <br />
                                        Ich bestätige, dass der Gegenstand irrtümlicherweise angelegt wurde und er in dieser Form nicht existiert. Ich möchte
                                        ihn daher deaktivieren. Für alle anderen Fälle nutze ich stattdessen die Funktion 'Ausscheiden anfordern'. *
                                    </Typography>
                                </Container>
                            }
                        />
                        <CustomButton
                            onClick={sendDeactivateRequest}
                            label="Deaktivierung anfordern"
                            symbol={<FlashOff />}
                            isDisabled={!isDeactivateCheck}
                        />
                    </>
                ) : (isDroppingReviewer || isAdminModeActivated) && inventoryItem.droppingQueueRequester !== userId ? (
                    <>
                        {DroppingActivationUtil.isDrop(inventoryItem) && (
                            <>
                                {droppingInfo()}
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Box
                                        mx={0.5}
                                        sx={{ animation: `${blink} 1s linear infinite` }}
                                    >
                                        <CustomButton
                                            onClick={() => sendDrop(true)}
                                            label="Ausscheidung bestätigen"
                                            symbol={<DeleteForever />}
                                        />
                                    </Box>
                                    <Box
                                        mx={0.5}
                                        sx={{ animation: `${blink} 1s linear infinite` }}
                                    >
                                        <CustomButton
                                            onClick={() => sendDrop(false)}
                                            label="Ausscheidung ablehnen"
                                            symbol={<Cancel />}
                                        />
                                    </Box>
                                </Grid>
                            </>
                        )}
                        {DroppingActivationUtil.isDeactivate(inventoryItem) && (
                            <>
                                <Typography textAlign="center">
                                    <strong>Die Deaktivierung des Gegenstands wurde angefordert.</strong>
                                </Typography>
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Box
                                        mx={0.5}
                                        sx={{ animation: `${blink} 1s linear infinite` }}
                                    >
                                        <CustomButton
                                            onClick={() => sendDeactivate(true)}
                                            label="Deaktivierung bestätigen"
                                            symbol={<FlashOff />}
                                        />
                                    </Box>
                                    <Box
                                        mx={0.5}
                                        sx={{ animation: `${blink} 1s linear infinite` }}
                                    >
                                        <CustomButton
                                            onClick={() => sendDeactivate(false)}
                                            label="Deaktivierung ablehnen"
                                            symbol={<Cancel />}
                                        />
                                    </Box>
                                </Grid>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        {DroppingActivationUtil.isDrop(inventoryItem) && <>{droppingInfo()}</>}
                        {DroppingActivationUtil.isDeactivate(inventoryItem) && (
                            <Typography textAlign="center">
                                <strong>Die Deaktivierung wurde angefordert.</strong>
                            </Typography>
                        )}
                        {inventoryItem.droppingQueueRequester === userId ? (
                            <>
                                <Typography textAlign="center">
                                    Bitte jemanden, den Vorgang zu bestätigen, oder brich ihn selbstständig wieder ab, um die Aktion rückgängig zu machen.
                                </Typography>
                                <CustomButton
                                    onClick={revokeDroppingQueue}
                                    label="Vorgang abbrechen"
                                    symbol={<Cancel />}
                                />
                            </>
                        ) : (
                            <Typography textAlign="center">Warte, bis der Vorgang abgeschlossen wurde.</Typography>
                        )}
                    </>
                )
            ) : (
                <Tooltip
                    title={
                        !isAdminModeActivated
                            ? isAdmin || isSuperAdmin
                                ? 'Wenn du den Gegenstand reaktivieren möchtest, musst du zunächst den Admin-Modus aktivieren!'
                                : 'Wenn du den Gegenstand reaktivieren möchtest, musst du dich dazu an einen Admin wenden.'
                            : undefined
                    }
                    followCursor={true}
                    enterDelay={500}
                >
                    <Box /* necessary for showing tooltip */>
                        <CustomButton
                            onClick={sendReactivate}
                            label="Reaktivieren"
                            isDisabled={!isAdminModeActivated}
                            symbol={<FlashOn />}
                        />
                    </Box>
                </Tooltip>
            )}
        </Grid>
    );
}
