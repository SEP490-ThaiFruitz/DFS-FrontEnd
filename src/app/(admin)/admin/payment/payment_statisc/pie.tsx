import React from 'react'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Legend, Pie, PieChart, ResponsiveContainer, TooltipProps } from 'recharts'
import { STATUS_SELECT } from '@/features/admin/admin-lib/admin-lib';
import { formatVND } from '@/lib/format-currency';

interface PaymentStatus {
  status: string;
  amount: number;
  numberOfTransaction: number;
}

interface PaymentPieProps {
  paymentStatus: PaymentStatus[]
}


function PaymentPie({ paymentStatus }: Readonly<PaymentPieProps>) {
  const colors = [
    "#8884d8",
    "#ff7f50",
    "#82ca9d",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
    "#ffc0cb",
  ]

  const CustomTooltip = ({ active, payload }: TooltipProps<any, any>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const className = `border-l-[${data.fill}] px-2 border-l-4 flex flex-col space-y-2`
      return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-2 space-x-3">
          <div className={className}>
            <p className="font-semibold">{data.name}</p>
            <p>{`Số giao dịch: ${data.value}`}</p>
            <p>{`Số tiền: ${formatVND(data.amount)}`}</p>
          </div>
        </div>
      )
    }

    return null;
  };


  const chartConfigPie: ChartConfig = {
    value: { label: "Tổng tiền" },
    ...paymentStatus.reduce((acc, item, index) => {
      acc[item.status] = {
        label: STATUS_SELECT[item.status],
        color: colors[index % colors.length],
        amount: item.amount,
        value: item.numberOfTransaction,
      }
      return acc
    }, {} as Record<string, { label: string, color: string, value: number, amount: number }>),
  }

  const pieData = paymentStatus.map((item, index) => ({
    name: STATUS_SELECT[item.status],
    value: item.numberOfTransaction,
    amount: item.amount,
    fill: colors[index % colors.length],
  }))

  return (
    <ChartContainer config={chartConfigPie} className="w-full h-full">
      <div className="flex flex-col items-center space-y-4 w-full">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart
            accessibilityLayer
          >
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="80%"
              dataKey="value"
              nameKey="name"
              label
              className="text-lg"

            />
            <ChartTooltip content={<CustomTooltip />} cursor={true} />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  )
}

export default PaymentPie
