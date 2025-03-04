import yfinance as yf
import pandas as pd
import os
from supabase import create_client, Client

# Define the stock symbol (e.g., Apple, Tesla, S&P 500 ETF)
ticker_symbols = ["AAPL", "TSLA", "SPY"]

url = os.environ.get("DB_URL")
key = os.environ.get("DB_KEY")

# Debugging: Print whether variables exist (but NOT their values)
if not url or not key:
    raise ValueError("ERROR: DB_URL or DB_KEY is missing. Check GitHub secrets.")

supabase: Client = create_client(url, key)

for ticker_symbol in ticker_symbols:
    # Fetch historical data (last 1 day, daily interval)
    stock_data = yf.download(ticker_symbol, period="1d", interval="1d")

    # Conver the ticker symbol to a string, add it as a column to the stock data
    ticker_symbol = str(ticker_symbol)
    stock_data["ticker"] = ticker_symbol

    # Convert the date to a column
    stock_data.reset_index(inplace=True)

    if isinstance(stock_data.columns, pd.MultiIndex):
        try:
            stock_data.columns = ["date", "close", "high", "low", "open", "volume", "ticker"]
        except:
            print("Expected columns not found")
    else:
        print("Expected columns not found")
    
    # Format all dates to be in the format YYYY-MM-DD HH:mm:ss
    stock_data["date"] = pd.to_datetime(stock_data["date"]).dt.strftime("%Y-%m-%d %H:%M:%S")

    # Try to upload the stock data to the database
    try:
        response = (
            supabase.table("stocks")
            .insert(stock_data.to_dict(orient="records"))
            .execute()
        )
    except Exception as e:
        print(e)