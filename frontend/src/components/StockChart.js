import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
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
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={stockData}>
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="close" 
            stroke="#2196F3" 
            name="Stock Price"
            dot={false}
            strokeWidth={2}
          />
          {signals.movingAverage && (
            <Line
              type="monotone"
              dataKey="ma_20"
              stroke="#FF9800"
              name="Moving Average"
              dot={false}
              strokeWidth={1}
            />
          )}
          {signals.rsi && (
            <Line
              type="monotone"
              dataKey="rsi_14"
              stroke="#4CAF50"
              name="RSI"
              dot={false}
              strokeWidth={1}
            />
          )}
          {signals.bollingerBands && (
            <>
              <Line
                type="monotone"
                dataKey="bb_upper"
                stroke="#9C27B0"
                name="Upper Band"
                dot={false}
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              <Line
                type="monotone"
                dataKey="bb_lower"
                stroke="#9C27B0"
                name="Lower Band"
                dot={false}
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;