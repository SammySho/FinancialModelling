import React from 'react';
import styles from './TickerSelector.module.css';

const AVAILABLE_TICKERS = ["AAPL", "META", "AMZN", "GOOG", "NFLX"];

const TickerSelector = ({ selectedTicker, onTickerChange, disabled }) => {
  return (
    <div className={styles.selectContainer}>
      <label htmlFor="ticker-select">Select Ticker:</label>
      <select 
        id="ticker-select"
        className={styles.select}
        value={selectedTicker} 
        onChange={(e) => onTickerChange(e.target.value)}
        disabled={disabled}
      >
        {AVAILABLE_TICKERS.map(ticker => (
          <option key={ticker} value={ticker}>{ticker}</option>
        ))}
      </select>
    </div>
  );
};

export default TickerSelector;