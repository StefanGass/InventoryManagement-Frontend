import { FC, useContext } from 'react';
import QRCodeSVG from 'qrcode.react';
import { darkBackground, mainBlack, mainWhite } from 'styles/theme';
import { UserContext } from 'pages/_app';

interface IQrCodeProps {
    value: string;
    size: number;
}

const QrCode: FC<IQrCodeProps> = (props) => {
    const { value, size } = props;
    const { themeMode } = useContext(UserContext);

    return (
        <QRCodeSVG
            size={size}
            value={value}
            bgColor={themeMode === 'dark' ? darkBackground : mainWhite}
            fgColor={themeMode === 'dark' ? mainWhite : mainBlack}
        />
    );
};

export default QrCode;
