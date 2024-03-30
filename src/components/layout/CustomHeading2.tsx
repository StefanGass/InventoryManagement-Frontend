import { Typography } from '@mui/material';

interface ICustomHeading2Props {
    text: string;
}

export default function CustomHeading2(props: ICustomHeading2Props) {
    const { text } = props;
    return (
        <Typography
            variant="h2"
            justifyContent="center"
            textAlign="center"
            gutterBottom
        >
            {text}
        </Typography>
    );
}
