import yfinance as yf
import pandas as pd
import os
from supabase import create_client, Client
from typing import Dict

class TechnicalIndicators:
    def __init__(self, df: pd.DataFrame):
        self.df = df.copy()
        self.df.sort_index(inplace=True)

    def calculate_ma(self, window: int = 20) -> pd.Series:
        """Calculate MA for entire series"""
        return self.df['close'].rolling(window=window).mean()

    def calculate_rsi(self, period: int = 14) -> pd.Series:
        """Calculate RSI for entire series"""
        delta = self.df['close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        rs = gain / loss
        return 100 - (100 / (1 + rs))

    def calculate_bollinger_bands(self, window: int = 20, num_std: float = 2) -> Dict[str, pd.Series]:
        """Calculate Bollinger Bands for entire series"""
        ma = self.df['close'].rolling(window=window).mean()
        std = self.df['close'].rolling(window=window).std()
        return {
            'bb_middle': ma,
            'bb_upper': ma + (std * num_std),
            'bb_lower': ma - (std * num_std)
        }

def fetch_latest_data(ticker_symbol: str) -> dict:
    """
    Fetch last day's data with enough history for technical indicators
    Returns only the latest day's data with indicators
    """

    # Get required historical data for calculations (e.g., 30 days for 20-day MA)
    # Using 30 days to ensure we have enough data even with market holidays
    stock_data = yf.download(ticker_symbol, period="30d", interval="1d")

    # Conver the ticker symbol to a string, add it as a column to the stock data
    ticker_symbol = str(ticker_symbol)
    stock_data["ticker"] = ticker_symbol

    # Convert the date to a column
    stock_data.reset_index(inplace=True)

    if isinstance(stock_data.columns, pd.MultiIndex):
        try:
            stock_data.columns = ["date", "close", "high", "low", "open", "volume", "ticker"]
        except Exception as e   :
            raise ValueError(f"Expected columns not found for {ticker_symbol}: {e}")
    else:
        raise ValueError(f"Expected columns not found for {ticker_symbol}")

    # Format all dates to be in the format YYYY-MM-DD HH:mm:ss
    stock_data["date"] = pd.to_datetime(stock_data["date"]).dt.strftime("%Y-%m-%d %H:%M:%S")

    if stock_data.empty:
        raise ValueError(f"No data retrieved for {ticker_symbol}")
    
    # Calculate indicators using all historical data
    indicators = TechnicalIndicators(stock_data)

    latest_data = {
        'date': stock_data['date'].iloc[-1],
        'ticker': ticker_symbol,
        'open': float(stock_data['open'].iloc[-1]),
        'high': float(stock_data['high'].iloc[-1]),
        'low': float(stock_data['low'].iloc[-1]),
        'close': float(stock_data['close'].iloc[-1]),
        'volume': int(stock_data['volume'].iloc[-1]),
        'ma_20': float(indicators.calculate_ma(window=20).iloc[-1]),
        'rsi_14': float(indicators.calculate_rsi(period=14).iloc[-1])
    }

    # Add Bollinger Bands
    bb = indicators.calculate_bollinger_bands(window=20, num_std=2)
    latest_data.update({
        'bb_middle': float(bb['bb_middle'].iloc[-1]),
        'bb_upper': float(bb['bb_upper'].iloc[-1]),
        'bb_lower': float(bb['bb_lower'].iloc[-1])
    })

    return latest_data

def main():
    TICKER_SYMBOLS = ["AAPL", "META", "AMZN", "GOOG", "NFLX"]
    
    # Supabase setup
    url = os.environ.get("DB_URL")
    key = os.environ.get("DB_KEY")
    
    if not url or not key:
        raise ValueError("ERROR: DB_URL or DB_KEY is missing. Check GitHub secrets.")
    
    supabase = create_client(url, key)
    
    for ticker_symbol in TICKER_SYMBOLS:
        data = fetch_latest_data(ticker_symbol)
        if len(data) > 0:
            #Try to upload the stock data to the database
            try:
                response = (
                    supabase.table("stocks")
                    .insert(data)
                    .execute()
                )
                print("Data uploaded successfully")
            except Exception as e:
                print(e)

if __name__ == "__main__":
    main()