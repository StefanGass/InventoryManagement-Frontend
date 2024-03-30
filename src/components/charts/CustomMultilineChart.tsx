import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { IChartItem } from 'components/interfaces';
import { useContext } from 'react';
import defaultTheme, { darkGrey, darkTheme, lightGrey } from 'styles/theme';
import { UserContext } from '../../../pages/_app';

interface ICustomMultilineChartProps {
    itemList: IChartItem[];
}

export default function CustomMultilineChart(props: ICustomMultilineChartProps) {
    const { itemList } = props;
    const { themeMode } = useContext(UserContext);

    return (
        <ResponsiveContainer
            minHeight={300}
            minWidth={300}
        >
            <LineChart
                data={itemList}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 30
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="processingDate" />
                <YAxis />
                <Tooltip
                    contentStyle={{ backgroundColor: themeMode === 'dark' ? darkTheme.palette.background.default : defaultTheme.palette.background.default }}
                />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="piecesCreated"
                    name="Angelegt"
                    stroke={themeMode === 'dark' ? darkTheme.palette.success.main : defaultTheme.palette.success.main}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="piecesManipulated"
                    name="Bearbeitet"
                    stroke={themeMode === 'dark' ? darkTheme.palette.primary.main : defaultTheme.palette.primary.main}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="piecesIssued"
                    name="Ausgegeben"
                    stroke={themeMode === 'dark' ? darkTheme.palette.info.main : defaultTheme.palette.info.main}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="piecesDropped"
                    name="Ausgeschieden"
                    stroke={themeMode === 'dark' ? darkTheme.palette.error.main : defaultTheme.palette.error.main}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="piecesActivated"
                    name="Aktiviert"
                    stroke={themeMode === 'dark' ? darkTheme.palette.warning.main : defaultTheme.palette.warning.main}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="piecesDeactivated"
                    name="Deaktiviert"
                    stroke={themeMode === 'dark' ? lightGrey : darkGrey}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
