#!/usr/bin/env python3
import requests
import json
from datetime import datetime
import time
from ratelimiter import RateLimiter

api_rate_limiter=RateLimiter(max_calls=5, period=30)

class Solution:
    @api_rate_limiter
    def get_stock_price(self):
        url='https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=NFLX&apikey=3CV39ZJZ3VTUHTLE'
        # url='https://www.data.pr4e.org/romeo.txt'
        try:
            response=requests.get(url)
            response.raise_for_status()
            data=response.json()
            print(json.dumps(data, indent=4))
        except requests.exceptions.HTTPError as http_error:
            print(f'an HTTPError exception occurred: ')
        except requests.exceptions.RequestException as request_exception:
            print(f'An RequestException exception occurred: ')


if __name__=="__main__":
    sol1=Solution()
    for i in range(0,60):
        print(f'{i}')
        print(datetime.now())
        time.sleep(1)
        sol1.get_stock_price()