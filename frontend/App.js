import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

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
    axios.get(`https://your-backend.com/stocks/${selectedTicker}`)
      .then((response) => setStockData(response.data))
      .catch((error) => console.error(error));
  }, [selectedTicker]);

  return (
    <div>
      <h2>Trading Strategy Simulator</h2>
      
      <label>Select Ticker:</label>
      <select value={selectedTicker} onChange={(e) => setSelectedTicker(e.target.value)}>
        {tickers.map(ticker => <option key={ticker} value={ticker}>{ticker}</option>)}
      </select>

      <h3>Select Trading Signals</h3>
      <label>
        <input type="checkbox" checked={signals.movingAverage} 
          onChange={() => setSignals({...signals, movingAverage: !signals.movingAverage})} />
        Moving Averages
      </label>
      <label>
        <input type="checkbox" checked={signals.rsi} 
          onChange={() => setSignals({...signals, rsi: !signals.rsi})} />
        RSI Indicator
      </label>
      <label>
        <input type="checkbox" checked={signals.bollingerBands} 
          onChange={() => setSignals({...signals, bollingerBands: !signals.bollingerBands})} />
        Bollinger Bands
      </label>

      <LineChart width={800} height={400} data={stockData}>
        <XAxis dataKey="date" />
        <YAxis />
        <CartesianGrid stroke="#ccc" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="close" stroke="blue" name="Stock Price" />
      </LineChart>
    </div>
  );
};

export default App;
