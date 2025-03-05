import os
import datetime
from fastapi import FastAPI, HTTPException
from supabase import create_client, Client
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# Read your Supabase credentials from environment variables
SUPABASE_URL = os.getenv("DB_URL")
SUPABASE_KEY = os.getenv("DB_KEY")


if not SUPABASE_URL or not SUPABASE_KEY:
    raise Exception("Missing Supabase credentials. Set DB_URL and DB_KEY environment variables.")

# Log the URL (but not the key, for security)
logger.info(f"Supabase URL: {SUPABASE_URL}")

# Create a Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

print("Successfully created Supabase client")

app = FastAPI()

@app.get("/test")
def test():
    return {"message": "Test endpoint is working."}

@app.get("/stocks/{ticker}")
def get_stock_data(ticker: str):
    # Calculate the date one year ago
    one_year_ago = (datetime.datetime.now() - datetime.timedelta(days=365)).date().isoformat()

    logger.info(f"Fetching data for ticker: {ticker} from {one_year_ago}")

    print("Calculated one year ago date:", one_year_ago)

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
        logger.error(f"Supabase error: {response.error.message}")
        raise HTTPException(status_code=400, detail=response.error.message)

    logger.info(f"Data retrieved: {response.data}")
    return response.data