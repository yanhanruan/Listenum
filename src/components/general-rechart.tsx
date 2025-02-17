"use client";

import React from "react";
import {
  LineChart,
  BarChart,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line,
  Bar,
  Area,
} from "recharts";

export type ChartType = "line" | "bar" | "area";

interface DataPoint {
  [key: string]: string | number;
}

interface GeneralChartProps {
  data: DataPoint[];
  chartType: ChartType;
  xKey: string;
  yKey: string;
  color?: string;
  height?: number;
}

export const GeneralChart: React.FC<GeneralChartProps> = ({
  data,
  chartType,
  xKey,
  yKey,
  color = "currentColor",
  height = 60,
}) => {
  const renderChart = () => {
    const axisProps = { stroke: "#888", fontSize: 6, tickLine: false, axisLine: false };
    switch (chartType) {
      case "line":
        return (
          <LineChart data={data}>
            <XAxis dataKey={xKey} {...axisProps} />
            <YAxis {...axisProps} />
            <Line type="monotone" dataKey={yKey} stroke={color} strokeWidth={1} dot={false} />
          </LineChart>
        );
      case "bar":
        return (
          <BarChart data={data}>
            <XAxis dataKey={xKey} {...axisProps} />
            <YAxis {...axisProps} />
            <Bar dataKey={yKey} fill={color} />
          </BarChart>
        );
      case "area":
        return (
          <AreaChart data={data}>
            <XAxis dataKey={xKey} {...axisProps} />
            <YAxis {...axisProps} />
            <Area type="monotone" dataKey={yKey} stroke={color} fill={color} />
          </AreaChart>
        );
      default:
        return (

            <LineChart data={data}>
  
              <XAxis dataKey={xKey} {...axisProps} />
  
              <YAxis {...axisProps} />
  
            </LineChart>
  
          );
    }
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      {renderChart()}
    </ResponsiveContainer>
  );
};
