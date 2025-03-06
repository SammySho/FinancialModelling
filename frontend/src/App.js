import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import styles from './App.module.css';

const App = () => {
  const [tickers] = useState(["AAPL", "SPY", "TSLA"]);
  const [selectedTicker, setSelectedTicker] = useState("AAPL");
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [signals, setSignals] = useState({
    movingAverage: false,
    rsi: false,
    bollingerBands: false,
  });
  const [backtestResult, setBacktestResult] = useState(null);
  const [backtestLoading, setBacktestLoading] = useState(false);

  // Get the backend URL from the environment variable once
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${backendUrl}/stocks/${selectedTicker}`);
        setStockData(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch stock data');
        console.error('Error fetching stock data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [selectedTicker, backendUrl]);

  const runBacktest = async () => {
    setBacktestLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/backtest/${selectedTicker}`, {
        signals: Object.keys(signals).filter(signal => signals[signal])
      });
      setBacktestResult(response.data);
    } catch (err) {
      setError(err.message || 'Failed to run backtest');
    } finally {
      setBacktestLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Trading Strategy Simulator</h2>

      <div className={styles.controlPanel}>
        <div className={styles.selectContainer}>
          <label htmlFor="ticker-select">Select Ticker:</label>
          <select
            id="ticker-select"
            className={styles.select}
            value={selectedTicker}
            onChange={(e) => setSelectedTicker(e.target.value)}
            disabled={loading}
          >
            {tickers.map(ticker => <option key={ticker} value={ticker}>{ticker}</option>)}
          </select>
        </div>

        <div className={styles.signalsSection}>
          <h3>Trading Signals</h3>
          <div className={styles.signalsContainer}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={signals.movingAverage}
                onChange={() => setSignals({ ...signals, movingAverage: !signals.movingAverage })}
                disabled={loading}
              />
              Moving Averages
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={signals.rsi}
                onChange={() => setSignals({ ...signals, rsi: !signals.rsi })}
                disabled={loading}
              />
              RSI Indicator
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={signals.bollingerBands}
                onChange={() => setSignals({ ...signals, bollingerBands: !signals.bollingerBands })}
                disabled={loading}
              />
              Bollinger Bands
            </label>
          </div>
        </div>
      </div>
      <div className={styles.backtestSection}>
        <button
          className={styles.backtestButton}
          onClick={runBacktest}
          disabled={loading || backtestLoading || !Object.values(signals).some(signal => signal)}
        >
          {backtestLoading ? 'Running Backtest...' : 'Run Backtest'}
        </button>

        {backtestResult && (
          <div className={styles.backtestResults}>
            <h4>Backtest Results</h4>
            <p>Initial Investment: £10,000</p>
            <p>Final Value: £{backtestResult.finalValue.toFixed(2)}</p>
            <p>Total Return: {backtestResult.totalReturn.toFixed(2)}%</p>
            <p>Number of Trades: {backtestResult.numberOfTrades}</p>
          </div>
        )}
      </div>

      <div className={styles.chartContainer}>
        {loading && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading {selectedTicker} data...</p>
          </div>
        )}

        {error && (
          <div className={styles.errorState}>
            <p>Error: {error}</p>
            <button
              onClick={() => setSelectedTicker(selectedTicker)}
              className={styles.retryButton}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
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
                  dataKey="ma"
                  stroke="#FF9800"
                  name="Moving Average"
                  dot={false}
                  strokeWidth={1}
                />
              )}
              {signals.rsi && (
                <Line
                  type="monotone"
                  dataKey="rsi"
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
                    dataKey="upperBand"
                    stroke="#9C27B0"
                    name="Upper Band"
                    dot={false}
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />
                  <Line
                    type="monotone"
                    dataKey="lowerBand"
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
        )}
      </div>
    </div>
  );
};

export default App;