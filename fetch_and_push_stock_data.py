import yfinance as yf
import pandas as pd
import os
from supabase import create_client, Client
import json

# Define the stock symbol (e.g., Apple, Tesla, S&P 500 ETF)
ticker_symbols = ["AAPL", "TSLA", "SPY"]

# Load the json called "supabase_keys.json"
with open(os.path.join("supabase_keys.json"), "r") as f:
    supabase_keys = json.load(f)

# Get the url and key from the json
url = supabase_keys["url"]
key = supabase_keys["key"]

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
        # Log the response to a log file
        with open("log.txt", "a") as f:
            f.write(f"Error: {e}\n")
            f.write(f"Response: {response}\n")
            f.write(f"Stock Data: {stock_data}\n")
            f.write(f"Ticker Symbol: {ticker_symbol}\n")