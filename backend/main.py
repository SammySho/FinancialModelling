import os
import datetime
from fastapi import FastAPI, HTTPException
from supabase import create_client, Client
from dotenv import load_dotenv
import logging
from fastapi.middleware.cors import CORSMiddleware

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

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/test")
def test():
    return {"message": "Test endpoint is working."}

@app.get("/stocks/{ticker}")
def get_stock_data(ticker: str):
    try:
        # Calculate the date one year ago
        one_year_ago = (datetime.datetime.now() - datetime.timedelta(days=365)).date().isoformat()

        logger.info(f"Fetching data for ticker: {ticker} from {one_year_ago}")

        # Query the "stocks" table
        response = (
            supabase.table("stocks")
            .select("*")
            .eq("ticker", ticker)
            .gte("date", one_year_ago)
            .order("date", desc=False)
            .execute()
        )

        # Debug information
        logger.info(f"Response type: {type(response)}")
        logger.info(f"Response dir: {dir(response)}")
        logger.info(f"Response dict: {response.__dict__}")

        # Access data directly without checking
        result_data = response.data if hasattr(response, 'data') else []
        
        logger.info(f"Result data: {result_data}")
        return result_data

    except Exception as e:
        logger.error(f"Error in get_stock_data: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error fetching data: {str(e)}")