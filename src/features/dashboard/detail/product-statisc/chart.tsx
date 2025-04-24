"use client"

import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { formatVND } from '@/lib/format-currency'
import React from 'react'
import { Area, AreaChart, CartesianGrid, TooltipProps, XAxis, YAxis } from "recharts"

interface ProductChartData {
    date: string
    quantitySold: number
    revenue: number
}

interface ProductChartProps {
    productCharts: ProductChartData[]
}

function ProductChart({ productCharts }: Readonly<ProductChartProps>) {

    const CustomTooltip = ({ active, payload }: TooltipProps<any, any>) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            const className = `border-l-[${data.color}] px-2 border-l-4 flex flex-col space-y-2`
            return (
                <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-2 space-x-3">
                    <div className={className}>
                        <p className="font-semibold">{data.date}</p>
                        <p>{`Số lượng: ${data.quantity}`}</p>
                        <p>{`Số tiền: ${formatVND(data.revenue)}`}</p>
                    </div>
                </div>
            )
        }

        return null;
    };

    const chartData = productCharts.map((item) => ({
        date: new Date(item.date).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }),
        revenue: item.revenue,
        quantity: item.quantitySold,
        color: "#f1c3b9"
    }))

    const chartConfig = {
        revenue: {
            label: "Doanh thu",
            color: "hsl(var(--chart-1))",
        }
    }

    return (
        <ChartContainer config={chartConfig}>
            <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                    left: 16,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={true} />
                <YAxis
                    className='min-w-fit'
                    tickFormatter={(value) =>
                        formatVND(value)
                    }
                />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip cursor={false} content={<CustomTooltip />} />
                <Area
                    dataKey="revenue"
                    type="natural"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.4}
                    stroke="hsl(var(--chart-1))"
                    name="Doanh thu"
                    scale={80}
                />
            </AreaChart>
        </ChartContainer>
    )
}

export default ProductChart
