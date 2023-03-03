import { FC } from 'react';
import { IPicture } from 'components/interfaces';
import { Box, Typography } from '@mui/material';

interface IPDFDisplayProps {
    pdfs: IPicture[];
}

const PDFDisplay: FC<IPDFDisplayProps> = ({ pdfs }) => {
    return (
        <Box sx={{ paddingTop: '1em' }}>
            <Typography
                variant="h2"
                align="center"
                gutterBottom
            >
                Dokumente
            </Typography>
            <div style={{ display: 'flex', flexFlow: 'column nowrap', alignItems: 'flex-end' }}>
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
            </div>
        </Box>
    );
};

export default PDFDisplay;
