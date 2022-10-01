import { Alert, Grid, Stack } from '@mui/material';
import { FC } from 'react';

interface IParameterFormAlert {
    addSuccessfulAlert: boolean;
    inputEmptyAlert: boolean;
    duplicateErrorAlert: boolean;
}

const ParameterFormAlert: FC<IParameterFormAlert> = (props) => {
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
                        {addSuccessfulAlert && <Alert severity="success">Parameter erfolgreich angelegt!</Alert>}
                        {inputEmptyAlert && <Alert severity="error">Pflichtfelder beachten!</Alert>}
                        {duplicateErrorAlert && <Alert severity="error">Parameter existiert bereits!</Alert>}
                    </Stack>
                </Grid>
            ) : null}
        </>
    );
};

export default ParameterFormAlert;
