import React, { useState } from 'react';
import axios from 'axios';
import styles from './BacktestPanel.module.css';

const BacktestPanel = ({ selectedTicker, signals, disabled }) => {
  const [backtestResult, setBacktestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const runBacktest = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/backtest/${selectedTicker}`, {
        signals: Object.keys(signals).filter(signal => signals[signal])
      });
      setBacktestResult(response.data);
    } catch (err) {
      console.error('Backtest failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const hasActiveSignals = Object.values(signals).some(signal => signal);

  return (
    <div className={styles.backtestSection}>
      <button 
        className={styles.backtestButton}
        onClick={runBacktest}
        disabled={disabled || loading || !hasActiveSignals}
      >
        {loading ? 'Running Backtest...' : 'Run Backtest'}
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
  );
};

export default BacktestPanel;