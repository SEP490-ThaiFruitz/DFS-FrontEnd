import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from '@/components/ui/chart'
import { formatVND } from '@/lib/format-currency';
import React from 'react'
import {
    CartesianGrid,
    Line,
    LineChart,
    XAxis,
    Legend,
    YAxis,
    Brush
} from 'recharts'

interface TransactionType {
    numberOfTransaction: number;
    amount: number;
}

interface ChartItem {
    date: string;
    buy: TransactionType;
    deposite: TransactionType;
    withdrawals: TransactionType;
    refund: TransactionType;
}

interface TransactionChartProps {
    chartData: ChartItem[];
}

function TransactionChart({ chartData }: Readonly<TransactionChartProps>) {
    const formattedData = chartData.map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
    }));
    const chartConfig = {
        buy: {
            label: "Mua hàng",
            color: "#34D399",
        },
        deposite: {
            label: "Nạp tiền",
            color: "#3B82F6",
        },
        withdrawals: {
            label: "Rút tiền",
            color: "#8B5CF6",
        },
        refund: {
            label: "Hoàn tiền",
            color: "#EF4444",
        },
    } satisfies ChartConfig;

    return (
        <ChartContainer config={chartConfig}>
            <LineChart
                accessibilityLayer
                data={formattedData}
                margin={{
                    left: 16,
                    right: 12,
                }}

            >
                <CartesianGrid vertical={false} />
                <YAxis
                    className='min-w-fit'
                    tickFormatter={(value) =>
                        formatVND(value)
                    }
                />
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                />
                <Brush dataKey="date" height={30} stroke="#3B82F6" />
                <ChartTooltip cursor={true} content={<ChartTooltipContent cursor={true}/>} />
                <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    iconSize={8}
                />
                <Line
                    dataKey="buy.amount"
                    type="monotone"
                    stroke={chartConfig.buy.color}
                    strokeWidth={2}
                    dot={false}
                    name={chartConfig.buy.label}
                />
                <Line
                    dataKey="deposite.amount"
                    type="monotone"
                    stroke={chartConfig.deposite.color}
                    strokeWidth={2}
                    dot={false}
                    name={chartConfig.deposite.label}
                />
                <Line
                    dataKey="withdrawals.amount"
                    type="monotone"
                    stroke={chartConfig.withdrawals.color}
                    strokeWidth={2}
                    dot={false}
                    name={chartConfig.withdrawals.label}
                />
                <Line
                    dataKey="refund.amount"
                    type="monotone"
                    stroke={chartConfig.refund.color}
                    strokeWidth={2}
                    dot={false}
                    name={chartConfig.refund.label}
                />
            </LineChart>
        </ChartContainer>
    );
}

export default TransactionChart;
