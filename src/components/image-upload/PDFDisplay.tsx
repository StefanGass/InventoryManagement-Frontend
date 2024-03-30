import { IPicture } from 'components/interfaces';
import { Box, Typography } from '@mui/material';

interface IPDFDisplayProps {
    pdfs: IPicture[];
}

export default function PDFDisplay(props: IPDFDisplayProps) {
    const { pdfs } = props;
    return (
        <Box paddingTop="1em">
            <Typography
                variant="h2"
                align="center"
                gutterBottom
            >
                Dokumente
            </Typography>
            <Box style={{ display: 'flex', flexFlow: 'column nowrap', alignItems: 'flex-end' }}>
                {pdfs?.map((pdf, index) => {
                    const byteCharacters = Buffer.from((pdf.pictureUrl as string)?.split(',')?.[1] ?? '', 'base64');
                    const byteArray = Uint8Array.from(byteCharacters);
                    const file = new Blob([byteArray], { type: 'application/pdf;base64' });
                    const fileURL = URL.createObjectURL(file);
                    return (
                        <a
                            key={`pdf-${pdf.id}-${index}`}
                            href={fileURL}
                            target="_blank"
                        >
                            {`Dokument-${index + 1}.pdf`}
                        </a>
                    );
                })}
            </Box>
        </Box>
    );
}
