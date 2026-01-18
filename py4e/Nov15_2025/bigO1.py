#!/usr/bin/env python3

stock_prices={
    'GOOGL': 155.25,
    'NVDA': 950.00,
    'AAPL': 1075.50   
}

def find_max_price_O1(prices: dict) -> tuple:
    if not prices:
        return None, 0.0
    
    highest_price=0.0
    highest_stock=None

    for ticker, price in prices.items():
        if price>highest_price:
            highest_price=price
            highest_stock=ticker
    return highest_stock, highest_price


def find_max_price_O2(prices: dict) -> tuple:
    if not prices:
        return None, 0.0
    
    highest_stock=max(prices,key=prices.get)
    highest_price=prices[highest_stock]
    return highest_stock, highest_price

# max_stock, max_price = find_max_price_O1(stock_prices)
max_stock, max_price = find_max_price_O2(stock_prices)
print(f'highest priced stock {max_stock} has price of ${max_price}')


'''
Are these two equivalent in time complexities?



 highest_stock = max(prices, key=prices.get)

    highest_price = prices[highest_stock]

  highest_price = max(prices.values())  
  stock_list=[]
  for k, v in prices.items():
      if v == highest_price:
          stock_list.append(k)
  highest_stock=stock_list[0]


  stock_prices={
    'GOOGL': 155.25,
    'NVDA': 950.00,
    'AAPL': 1075.50   
}

'''