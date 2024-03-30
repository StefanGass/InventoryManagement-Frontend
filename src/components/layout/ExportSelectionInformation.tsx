import { Box, Grid, Typography } from '@mui/material';
import { Info } from '@mui/icons-material';
import React from 'react';

interface IExportSelectionInformationProps {
    label: string | React.JSX.Element;
}

export default function ExportSelectionInformation(props: IExportSelectionInformationProps) {
    const { label } = props;
    return (
        <>
            <Box my={1} />
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                direction="row"
                flexWrap="nowrap"
            >
                <Info
                    fontSize="small"
                    sx={{ marginRight: '5px' }}
                />
                <Typography variant="caption">{label}</Typography>
            </Grid>
        </>
    );
}
