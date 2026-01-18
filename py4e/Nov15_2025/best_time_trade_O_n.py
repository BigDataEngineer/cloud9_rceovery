#!/usr/bin/env python3

class Solution:
    def get_max_profit(self, prices: list) -> tuple:
        n=len(prices)
        iteration=0
        max_profit=0.0
        min_price=prices[0]
        for i in range(1,n):
            iteration=iteration+1
            current_profit=prices[i]-min_price
            if current_profit>max_profit:
                max_profit=current_profit
            if prices[i]<min_price:
                min_price=prices[i]
        return max_profit, iteration
            


if __name__=='__main__':
    prices = [7, 1, 5, 3, 6, 4]*20000
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

    
