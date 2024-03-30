import { Typography } from '@mui/material';

interface ICustomHeading1Props {
    text: string;
}

export default function CustomHeading1(props: ICustomHeading1Props) {
    const { text } = props;
    return (
        <Typography
            variant="h1"
            justifyContent="center"
            textAlign="center"
            gutterBottom
        >
            {text}
        </Typography>
    );
}
