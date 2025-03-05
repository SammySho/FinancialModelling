import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import styles from './App.module.css';


const App = () => {
  const [tickers] = useState(["AAPL", "SPY", "TSLA"]);
  const [selectedTicker, setSelectedTicker] = useState("AAPL");
  const [stockData, setStockData] = useState([]);
  const [signals, setSignals] = useState({
    movingAverage: false,
    rsi: false,
    bollingerBands: false,
  });

  useEffect(() => {
    // Get the backend URL from the environment variable
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    axios.get(`${backendUrl}/stocks/AAPL`)
      .then(response => setStockData(response.data))
      .catch(error => console.error(error));
  }, [selectedTicker]);

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Trading Strategy Simulator</h2>
      
      <div className={styles.controlPanel}>
        <div className={styles.selectContainer}>
          <label>Select Ticker:</label>
          <select 
            className={styles.select}
            value={selectedTicker} 
            onChange={(e) => setSelectedTicker(e.target.value)}
          >
            {tickers.map(ticker => <option key={ticker} value={ticker}>{ticker}</option>)}
          </select>
        </div>

        <h3>Select Trading Signals</h3>
        <div className={styles.signalsContainer}>
          <label className={styles.checkboxLabel}>
            <input 
              type="checkbox"
              className={styles.checkbox}
              checked={signals.movingAverage} 
              onChange={() => setSignals({...signals, movingAverage: !signals.movingAverage})}
            />
            Moving Averages
          </label>
          <label className={styles.checkboxLabel}>
            <input 
              type="checkbox"
              className={styles.checkbox}
              checked={signals.rsi} 
              onChange={() => setSignals({...signals, rsi: !signals.rsi})}
            />
            RSI Indicator
          </label>
          <label className={styles.checkboxLabel}>
            <input 
              type="checkbox"
              className={styles.checkbox}
              checked={signals.bollingerBands} 
              onChange={() => setSignals({...signals, bollingerBands: !signals.bollingerBands})}
            />
            Bollinger Bands
          </label>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <LineChart width={800} height={400} data={stockData}>
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="close" stroke="#2196F3" name="Stock Price" />
        </LineChart>
      </div>
    </div>
  );
};

export default App;