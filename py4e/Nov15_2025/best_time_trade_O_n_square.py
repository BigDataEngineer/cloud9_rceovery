#!/usr/bin/env python3

class Solution:
    def get_max_profit(self, prices: list) -> tuple:
        n=len(prices)
        iteration=0
        # print(f'length of the list is {n}')
        max_profit=0.0
        for i in range(n-1):
            buy_price=prices[i]
            print(f'buy_price={buy_price}')
            for j in range(i+1,n):
                iteration=iteration+1
                sell_price=prices[j]
                print(f'sell_price={sell_price}')
                sell_profit=sell_price-buy_price
                # print(f'sell_profit={sell_profit}')
                if sell_profit>max_profit:
                    max_profit=sell_profit
        return max_profit, iteration

if __name__=='__main__':
    prices = [7, 2, 5, 3, 1, 8]*1
    sol=Solution()
    max_profit, iterations =sol.get_max_profit(prices)
    print(f'max profit is {max_profit}')
    print(f'iterations={iterations}')













'''
(n-1)+(n-2)

5,4,3,2,1



[1,3,0.5,5,2]


min_price=1
max_profit=2



min_price=0.5

max_profit=4.5

'''

    
