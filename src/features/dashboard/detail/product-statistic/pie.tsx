    import React from 'react'
    import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
    import { Legend, Pie, PieChart, ResponsiveContainer, TooltipProps } from 'recharts'
    import { formatVND } from '@/lib/format-currency'


    interface ProductVariant {
        productVariantImage: string
        packagingType: string
        netWeight: number
        quantitySold: number
        revenue: number
    }

    interface ProductPieProps {
        productVariants: ProductVariant[]
    }
    function ProductPie({ productVariants }: Readonly<ProductPieProps>) {
        const colors = [
            "#8884d8",
            "#82ca9d",
            "#ffc658",
            "#ff8042",
            "#8dd1e1",
            "#a4de6c",
            "#d0ed57",
            "#d8854f",
            "#888888",
            "#4db6ac",
        ];
        // Transform product variants data for the pie chart
        const variantChartData = productVariants.map((variant, index) => ({
            name: variant.packagingType + " - " + variant.netWeight + "g",
            value: variant.quantitySold,
            revenue: variant.revenue,
            fill: colors[index % colors.length],
        }))

        // Pie chart config
        const chartConfigPie = productVariants.reduce(
            (config, variant, index) => {
                return {
                    ...config,
                    [variant.packagingType]: {
                        label: variant.packagingType,
                        color: colors[index % colors.length],
                        value: variant.quantitySold
                    },
                }
            },
            { value: { label: "Số lượng" } },
        ) as ChartConfig

        const CustomTooltip = ({ active, payload }: TooltipProps<any, any>) => {
            if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                    <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-2 space-x-3">
                        <div
                            className="px-2 border-l-4 flex flex-col space-y-2"
                            style={{ borderLeftColor: data.fill }}
                        >
                            <p className="font-semibold">{data.name}</p>
                            <p>{`Số lượng: ${data.value}`}</p>
                            <p>{`Số tiền: ${formatVND(data.revenue)}`}</p>
                        </div>
                    </div>
                )
            }

            return null;
        };

        return (
            <ChartContainer config={chartConfigPie} className="w-full h-full">
                <div className="flex flex-col items-center space-y-4 w-full">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <ChartTooltip content={<CustomTooltip />} cursor={true} />
                            <Pie
                                data={variantChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius="40%"
                                outerRadius="80%"
                                dataKey="value"
                                nameKey="name"
                                label
                                className='text-lg'
                            />
                            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </ChartContainer>
        )
    }

    export default ProductPie
