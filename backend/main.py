import os
import datetime
from fastapi import FastAPI, HTTPException
from supabase import create_client, Client

# Read your Supabase credentials from environment variables
SUPABASE_URL = os.getenv("DB_URL")
SUPABASE_KEY = os.getenv("DB_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise Exception("Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_KEY environment variables.")

# Create a Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI()

@app.get("/stocks/{ticker}")
def get_stock_data(ticker: str):
    # Calculate the date one year ago
    one_year_ago = (datetime.datetime.now() - datetime.timedelta(days=365)).date().isoformat()

    # Query the "stocks" table for the given ticker and filter for the last year of data
    response = (
        supabase.table("stocks")
        .select("*")
        .eq("ticker", ticker)
        .gte("date", one_year_ago)
        .execute()
    )

    # Check if the query returned data
    if response.error:
        raise HTTPException(status_code=400, detail=response.error.message)

    return response.data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)