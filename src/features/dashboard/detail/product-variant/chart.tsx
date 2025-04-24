"use client"

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import React from 'react'
import { Bar, BarChart, Brush, CartesianGrid, XAxis, YAxis } from 'recharts';

interface ProductBatchStatistic {
    number: string;
    quantitySale: number;
    quantityDamge: number;
    quantityImport: number;
    quantityReturnToSupplier: number;
    quantityExpired: number;
    quantityOther: number;
}

interface ProductBatchChartProps {
    productBatchStatistics: ProductBatchStatistic[]
}


function ChartProductBatch({ productBatchStatistics }: Readonly<ProductBatchChartProps>) {

    const chartData = productBatchStatistics.map(batch => ({
        number: batch.number,
        Sale: batch.quantitySale,
        Damge: batch.quantityDamge,
        Import: batch.quantityImport,
        Return: batch.quantityReturnToSupplier,
        Expired: batch.quantityExpired,
        Other: batch.quantityOther,
    }));

    const chartConfig = {
        Sale: {
            label: "Bán",
            color: "#8884d8",
        },
        Damge: {
            label: "Hỏng",
            color: "#82ca9d",
        },
        Import: {
            label: "Nhập",
            color: "#ffc658",
        },
        Return: {
            label: "Trả NCC",
            color: "#ff8042",
        },
        Expired: {
            label: "Hết hạn",
            color: "#a4de6c",
        },
        Other: {
            label: "Khác",
            color: "#d0ed57",
        },
    } satisfies ChartConfig;

    return (
        <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={true} />
                <YAxis className='min-w-fit' />
                <XAxis
                    dataKey="number"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                />
                <Brush dataKey="date" height={30} stroke="#3B82F6" />
                <Bar dataKey="Sale" fill="#8884d8" radius={4} />
                <Bar dataKey="Damge" fill="#82ca9d" radius={4} />
                <Bar dataKey="Import" fill="#ffc658" radius={4} />
                <Bar dataKey="Return" fill="#ff8042" radius={4} />
                <Bar dataKey="Expired" fill="#a4de6c" radius={4} />
                <Bar dataKey="Other" fill="#d0ed57" radius={4} />

            </BarChart>
        </ChartContainer>
    )
}

export default ChartProductBatch
