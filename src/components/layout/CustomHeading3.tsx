import { Typography } from '@mui/material';
import React from "react";

interface ICustomHeading3Props {
    text: string | React.JSX.Element;
}

export default function CustomHeading3(props: ICustomHeading3Props) {
    const { text } = props;
    return (
        <Typography
            variant="h3"
            justifyContent="center"
            textAlign="center"
            gutterBottom
        >
            {text}
        </Typography>
    );
}
