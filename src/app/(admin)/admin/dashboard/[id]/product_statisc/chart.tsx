"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { formatVND } from '@/lib/format-currency'
import React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

interface ProductChartData {
    date: string
    quantitySold: number
    revenue: number
}

interface ProductChartProps {
    productCharts: ProductChartData[]
}

function ProductChart({ productCharts }: Readonly<ProductChartProps>) {

    const chartData = productCharts.map((item) => ({
        date: new Date(item.date).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }),
        revenue: item.revenue,
        quantity: item.quantitySold,
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
                <CartesianGrid vertical={false} />
                <YAxis
                    className='min-w-fit'
                    tickFormatter={(value) =>
                       formatVND(value)
                    }
                />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
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
