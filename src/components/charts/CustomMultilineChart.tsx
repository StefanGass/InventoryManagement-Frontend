import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { IChartItem } from 'components/interfaces';
import { FC, useContext } from 'react';
import lightTheme, { darkTheme, defaultInfoBlue, mainGold, mainRedDarkMode, mainRedLightMode } from 'styles/theme';
import { UserContext } from 'pages/_app';

interface ICustomMultilineChartProps {
    itemList: IChartItem[];
}

const CustomMultilineChart: FC<ICustomMultilineChartProps> = (props) => {
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
                    contentStyle={{ backgroundColor: themeMode === 'dark' ? darkTheme.palette.background.default : lightTheme.palette.background.default }}
                />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="piecesCreated"
                    name="Angelegt"
                    stroke={themeMode === 'dark' ? darkTheme.palette.success.main : lightTheme.palette.success.main}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="piecesManipulated"
                    name="Bearbeitet"
                    stroke={defaultInfoBlue}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="piecesIssued"
                    name="Ausgegeben"
                    stroke={mainGold}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="piecesDropped"
                    name="Ausgeschieden"
                    stroke={themeMode === 'dark' ? mainRedDarkMode : mainRedLightMode}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="piecesActivated"
                    name="Aktiviert"
                    stroke={themeMode === 'dark' ? darkTheme.palette.warning.main : lightTheme.palette.warning.main}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="piecesDeactivated"
                    name="Deaktiviert"
                    stroke={themeMode === 'dark' ? darkTheme.palette.error.main : lightTheme.palette.error.main}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default CustomMultilineChart;
