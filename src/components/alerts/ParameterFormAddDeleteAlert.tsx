import { Alert, Grid, Stack } from '@mui/material';
import { FC } from 'react';

interface IParameterFormAlert {
    addSuccessfulAlert: boolean;
    inputEmptyAlert: boolean;
    duplicateErrorAlert: boolean;
}

const ParameterFormAddDeleteAlert: FC<IParameterFormAlert> = (props) => {
    const { addSuccessfulAlert, inputEmptyAlert, duplicateErrorAlert } = props;
    return (
        <>
            {addSuccessfulAlert || inputEmptyAlert || duplicateErrorAlert ? (
                <Grid
                    container
                    justifyContent="center"
                >
                    <Stack
                        sx={{
                            width: '17em',
                            marginTop: '0.8em',
                            marginBottom: '0.5em'
                        }}
                        spacing={2}
                    >
                        {addSuccessfulAlert && <Alert severity="success">Aktion erfolgreich!</Alert>}
                        {inputEmptyAlert && <Alert severity="error">Mindestens ein:e User:in auswählen!</Alert>}
                        {duplicateErrorAlert && (
                            <Alert severity="error">
                                Ein:e User:in kann maximal zu einer Abteilung hinzugefügt werden! Bitte den/die User:in zunächst von der ursprünglichen
                                Abteilung entfernen!
                            </Alert>
                        )}
                    </Stack>
                </Grid>
            ) : null}
        </>
    );
};

export default ParameterFormAddDeleteAlert;
