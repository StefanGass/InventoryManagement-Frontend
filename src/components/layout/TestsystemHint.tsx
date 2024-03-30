import { Box, Typography } from '@mui/material';
import { errorRed, mainWhite } from 'styles/theme';
import { BugReport } from '@mui/icons-material';

export default function TestsystemHint() {
    return (
        <Box
            sx={{
                width: '3.5em',
                height: '3.5em',
                background: `linear-gradient(135deg, red 0%, ${errorRed} 50%)`,
                position: 'fixed',
                top: 0,
                left: 0,
                clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                zIndex: 5000,
                transition: 'width 0.2s ease-in-out, height 0.2s ease-in-out',
                '&:hover': {
                    width: '7em',
                    height: '7em'
                }
            }}
        >
            <BugReport
                fontSize="large"
                sx={{ marginTop: '5px', marginLeft: '5px', color: mainWhite }}
            />
            <Box sx={{ position: 'relative', top: -20, left: -5, color: mainWhite, transform: 'rotate(315deg)' }}>
                <Typography fontWeight={750}>TESTSYSTEM</Typography>
            </Box>
        </Box>
    );
}
