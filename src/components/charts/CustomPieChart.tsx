import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { IChartItem } from 'components/interfaces';
import {Box} from "@mui/material";

interface ICustomPieChartProps {
    itemList: IChartItem[];
}

interface IPieChartData {
    name: string;
    value: number;
}

const PI_COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#DC143C',
    '#9400D3',
    '#008000',
    '#FF1493',
    '#20B2AA',
    '#FF6347',
    '#6A5ACD',
    '#D2691E',
    '#6495ED'
];

export default function CustomPieChart(props: ICustomPieChartProps) {
    const { itemList } = props;

    const dataList: IPieChartData[] = [];
    itemList.map((item) => dataList.push({ name: item.department.departmentName, value: item.pieces }));

    return (
        <Box style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                    />
                    <Pie
                        dataKey="value"
                        data={dataList}
                        label
                    >
                        {dataList.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={index < 13 ? PI_COLORS[index] : '#' + Math.floor(Math.random() * 16777215).toString(16)}
                            />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </Box>
    );
}
