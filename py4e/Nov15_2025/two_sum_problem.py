#!/usr/bin/env python3

'''
1. Two SumProblem Description: Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target. Assume exactly one solution exists, and you can't use the same element twice.Time Complexity Challenge:Brute Force: Checking every pair is $O(N^2)$.Optimized Solution: Using a Hash Map (or dictionary) to store the elements and their indices allows you to check for the required complement (i.e., target - current_number) in $O(1)$ time. This brings the overall complexity down to $O(N)$.
'''


class Solution:
    def two_sum(self, nums: list, target: int) -> list:
        seen = {}
        n = len(nums)
        for i in range(n):
            complement = target - nums[i]
            if complement in seen:
                return [seen[complement],i]
            else:
                seen[nums[i]] = i
                print(seen)
        return[]
        
if __name__=='__main__':
    sol=Solution()
    data=[2, 7, 11, 15]
    result=sol.two_sum(data,9)
    print(result)