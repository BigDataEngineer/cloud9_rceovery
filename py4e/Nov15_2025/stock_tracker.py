#!/usr/bin/env python3

import requests
import json
from concurrent.futures import ThreadPoolExecutor as PoolExecutor
import re
from ratelimiter import RateLimiter
from datetime import datetime

# stocks=['NVDA', 'AAPL', 'GOOGL']
api_rate_limiter=RateLimiter(max_calls=3, period=30)
class Solution:
    @api_rate_limiter
    def get_quote(self, stock_ticker: str) -> None:
        try:
            url=f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={stock_ticker}&apikey=3CV39ZJZ3VTUHTLE'
            now=datetime.now()
            print(f'{now}: Making API call to get price for {stock_ticker}')
            resp = requests.get(url)
            resp.raise_for_status()
            resp_data=resp.json()
            print(f'Returned data {resp_data}')
                        
            # pattern=r'"05. price": ([^,]+)'
            # price_match=re.search(pattern,resp_data)
            # price=price_match.group(1)
            price=resp_data['Global Quote']['05. price']
            price=float(price)
            print(f'Returned price {price}')
 
            stock_dict[stock_ticker]=price
        except requests.exceptions.HTTPError as HTTPError:
            print(f'An HTTPError exception occured: {HTTPError}')
        except requests.exceptions.RequestException as request_exception:
            print(f'An exception occurred: {request_exception}')
        except:
            print(f'An exception occured')

if __name__=='__main__':
    # stock_dict={}
    
    sol1=Solution()

    while True:
        stock_dict={}
        stock_list=['NVDA', 'AAPL', 'GOOGL']
        with PoolExecutor(max_workers=3) as executor:
            for _ in executor.map(sol1.get_quote,stock_list):
                pass
        print(stock_dict)
        highest_stock_price=max(stock_dict.values())
        stock_list=[]
        for k, v in stock_dict.items():
            if v == highest_stock_price:
                stock_list.append(k)

        print(f'Highest stock price is {highest_stock_price} and stocks having that price are {stock_list}')







'''
Problem Statement: Real-Time Top Stock Tracker
The goal is to develop a Python application that continuously monitors and displays the highest-priced stock from a defined watchlist, while strictly adhering to external API rate limits.

Detailed Requirements
1. Data Acquisition and Scope
API Source: Alpha Vantage.

Watchlist Size: 10 predefined stock tickers (e.g., AAPL, MSFT, GOOGL, etc.).

Data Point: The application must retrieve the current stock quote (price) for all 10 tickers.

2. Concurrency and Rate Limiting
Rate Constraint: The application must not exceed 10 total API queries per every 5-second interval.

Strategy: Instead of using a simple, fixed time.sleep() for 5 seconds between batches, the application must implement a rate-limiting mechanism (e.g., using a thread pool or asynchronous programming) that ensures only 10 requests are made within the sliding 5-second window.

3. Application Logic and Output
Execution: The application must run continuously until manually stopped.

Processing: For every complete set of 10 retrieved quotes, the application must identify and track the single stock with the highest current price.

Output: The application must continuously print (or update a display with) the ticker symbol and the price of the current top-priced stock.

4. Technical Challenges to Address
Handling API Errors: The application must gracefully handle potential API connection errors or rate limit exceeding errors (if the limit is accidentally breached).

Concurrency Management: The application must efficiently manage threads/workers to execute the 10 queries without blocking the main program loop, optimizing for the 5-second limit.

https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=NFLX&apikey=3CV39ZJZ3VTUHTLE

'''

