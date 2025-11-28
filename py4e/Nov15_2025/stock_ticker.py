#!/usr/bin/env python3

'''
What is the most effective Python implementation for a script that continuously monitors (polls) the real-time stock prices for a defined list of tickers via a network API, integrates robust rate-limiting to prevent API overuse, and dynamically identifies and reports the ticker with the highest current market value in real-time?
'''

# class Solution:
#     def stock_ticker():




'''
(NFLX, 200)
(ALPH, 300)



start loop
largest_ticker=0
if a>=largest_ticker:
    largest_ticker=a
else:
    continue
end loop


largest_ticker=0
list1=[2,4,5,3,2,3,7,8, 200, 0]
for i in range(len(list1)):
    if list1[i] >= largest_ticker:
        largest_ticker=list1[i]
    else:
        continue
print('largest ticke3', largest_ticker)



get/track two values, ticker and the price
'''
ticker_1=('NFLX',100)
ticker_2=('ALPH',300)
ticker_1=('APPL',200)

dict1={'NFLX':100, 'ALPH':300, 'APPL':200}

largest_ticker=None
largest_ticker_price=0

list1=[2,4,5,3,2,3,7,8, 200, 0]
# print(dict1)
# print(dict1.items())
# for k,v in dict1.items():
#     print(f'{k}:{v}')

largest_value=0

for k,v in dict1.items():
    if v >= largest_value:
        largest_value=v
        ticker=k
    else:
        continue

print(ticker,largest_value)






    # if list1[i] >= largest_ticker:
    #     largest_ticker=list1[i]
    # else:
    #     continue
# print('largest ticker', largest_ticker)



