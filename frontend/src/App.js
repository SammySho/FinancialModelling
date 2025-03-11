import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
//import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import TickerSelector from './components/TickerSelector';
import SignalPanel from './components/SignalPanel';
import BacktestPanel from './components/BacktestPanel';
import StockChart from './components/StockChart';
import styles from './App.module.css';

const App = () => {
  const [selectedTicker, setSelectedTicker] = useState("AAPL");
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [signals, setSignals] = useState({
    movingAverage: false,
    rsi: false,
    bollingerBands: false,
  });

  // Get the backend URL from the environment variable once
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${backendUrl}/stocks/${selectedTicker}`);
        // Print out the backend url
        console.log('Backend URL:', backendUrl);
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

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Trading Strategy Simulator</h2>
      
      <div className={styles.controlPanel}>
        <TickerSelector 
          selectedTicker={selectedTicker}
          onTickerChange={setSelectedTicker}
          disabled={loading}
        />

        <div className={styles.analysisPanel}>
          <SignalPanel 
            signals={signals}
            onSignalChange={setSignals}
            disabled={loading}
          />
          
          <BacktestPanel 
            selectedTicker={selectedTicker}
            signals={signals}
            disabled={loading}
          />
        </div>
      </div>

      <StockChart 
        stockData={stockData}
        signals={signals}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default App;