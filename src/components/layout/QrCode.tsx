import { useContext } from 'react';
import QRCodeSVG from 'qrcode.react';
import defaultTheme, { darkTheme, mainBlack, mainWhite } from 'styles/theme';
import { UserContext } from '../../../pages/_app';

interface IQrCodeProps {
    value: string;
    size: number;
}

export default function QrCode(props: IQrCodeProps) {
    const { value, size } = props;
    const { themeMode } = useContext(UserContext);

    return (
        <QRCodeSVG
            size={size}
            value={value}
            bgColor={themeMode === 'dark' ? darkTheme.palette.background.default : defaultTheme.palette.background.default}
            fgColor={themeMode === 'dark' ? mainWhite : mainBlack}
        />
    );
}
