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
                                fill={'#' + Math.floor(Math.random() * 16777215).toString(16)}
                            />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </Box>
    );
}
