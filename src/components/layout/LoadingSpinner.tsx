import { Box, CircularProgress } from '@mui/material';
import { IHidden } from "components/interfaces";
import { FC } from "react";

const LoadingSpinner:FC<IHidden> = (props) => {
    const {hidden} = props;
    if(hidden){
        return (<></>);
    }
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            marginTop="4em"
            sx={{ display: 'flex' }}
        >
            <CircularProgress />
        </Box>
    );
};

export default LoadingSpinner;
