'use client'

import React from 'react'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { Area, AreaChart, CartesianGrid, TooltipProps, XAxis, YAxis } from "recharts"
import { formatVND } from '@/lib/format-currency';
import { PAYMENT_SELECT } from '@/features/admin/admin-lib/admin-lib';

interface PaymentChartItem {
  date: string;
  amount: number;
  paymentMethods: PaymentMethodChart[];
}

interface PaymentMethodChart {
  method: string;
  amount: number;
  numberOfTransaction: number;
}

interface PaymentChartProps {
  paymentCharts: PaymentChartItem[];
}


function PaymentChart({ paymentCharts }: Readonly<PaymentChartProps>) {
  const chartData = paymentCharts?.map((item: PaymentChartItem) => {
    return {
      date: new Date(item.date).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      money: item.amount,
      paymentMethods: item.paymentMethods
    }
  });

  const chartConfig = {
    money: {
      label: "Tổng tiền",
      color: "hsl(var(--chart-1))",
    },
  };

  const CustomTooltip = ({ active, payload }: TooltipProps<any, any>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const paymentMethods: PaymentMethodChart[] = data.paymentMethods ?? [];

      return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3">
          <div className="px-3 py-2 w-full">
            <div className="mb-1.5 font-bold">{data.date}</div>
            <div className="mb-2 text-sm">Tổng tiền: {formatVND(data.money)}</div>
            <div className="space-y-1.5 pt-1.5 border-t border-border">
              {paymentMethods.map((method) => (
                <div key={method.method} className="text-sm flex justify-between items-center gap-10">
                  <span>{PAYMENT_SELECT[method.method]}:</span>
                  <span>
                    {formatVND(method.amount)}<span className="mx-1 text-border">•</span>
                    <span>{method.numberOfTransaction} giao dịch</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    }
    return null;
  };

  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 16,
          right: 12,
        }}>
        <CartesianGrid vertical={true} />
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
        <ChartTooltip cursor={false} content={<CustomTooltip />} />
        <Area
          dataKey="money"
          type="natural"
          fill="hsl(var(--chart-1))"
          fillOpacity={0.4}
          stroke="hsl(var(--chart-1))"
          name="Tổng tiền"
        />
      </AreaChart>
    </ChartContainer>
  );
}

export default PaymentChart 