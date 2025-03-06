import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  ComposedChart,
  ReferenceLine
} from "recharts";
import styles from './StockChart.module.css';

const StockChart = ({ stockData, signals, loading, error }) => {
  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.chartContainer}>
      {/* Main price chart */}
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={stockData}>
          <XAxis dataKey="date" />
          <YAxis yAxisId="price" domain={['auto', 'auto']} />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Tooltip />
          <Legend />

          {/* Base price line */}
          <Line
            id="price-line"
            yAxisId="price"
            type="monotone"
            dataKey="close"
            stroke="#2196F3"
            name="Stock Price"
            dot={false}
            strokeWidth={2}
          />

          {/* Bollinger Bands */}
          {signals.bollingerBands && (
            <Line
              id="bb-upper"
              yAxisId="price"
              type="monotone"
              dataKey="bb_upper"
              stroke="#9C27B0"
              name="Upper Band"
              dot={false}
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          )}
          {signals.bollingerBands && (
            <Line
              id="bb-lower"
              yAxisId="price"
              type="monotone"
              dataKey="bb_lower"
              stroke="#9C27B0"
              name="Lower Band"
              dot={false}
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          )}

          {/* Moving Average */}
          {signals.movingAverage && (
            <Line
              id="ma-line"
              yAxisId="price"
              type="monotone"
              dataKey="ma_20"
              stroke="#FF9800"
              name="Moving Average (20)"
              dot={false}
              strokeWidth={1.5}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      {/* RSI chart */}
      {signals.rsi && (
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={stockData}>
            <XAxis dataKey="date" />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 30, 70, 100]}
              label={{ value: 'RSI', angle: -90, position: 'insideLeft' }}
            />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="rsi_14"
              stroke="#4CAF50"
              name="RSI (14)"
              dot={false}
              strokeWidth={1}
            />
            {/* Add reference lines for overbought/oversold levels */}
            <ReferenceLine y={70} stroke="red" strokeDasharray="3 3" />
            <ReferenceLine y={30} stroke="green" strokeDasharray="3 3" />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default StockChart;