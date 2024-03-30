import {AddCircleOutlined, Category, Flag, Home, InsertChart, TableChart} from '@mui/icons-material';
import { IRoute } from 'components/interfaces';

export const routes: IRoute[] = [
    { name: 'Start', symbol: <Home />, isUseSymbolInHeader: true, link: '/' },
    { name: 'Inventar', symbol: <TableChart />, isUseSymbolInHeader: true, link: '/inventar' },
    { name: 'Erfassen', symbol: <AddCircleOutlined />, isUseSymbolInHeader: true, link: '/erfassen' },
    { name: 'Anlegen', symbol: <Category />, isUseSymbolInHeader: true, link: '/anlegen' },
    { name: 'Aufgaben', symbol: <Flag />, isUseSymbolInHeader: true, link: '/aufgaben' },
    { name: 'Export', symbol: <InsertChart />, isUseSymbolInHeader: true, link: '/export' }
];
