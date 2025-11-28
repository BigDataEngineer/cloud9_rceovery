#!/usr/bin/env python3


class Solution:
    def isPalindrome(self, x):
        l1 = x
        l1=str(l1)
        len_l1 = len(l1)
        counter = 0
        for i in range(len_l1):
            if l1[i] == l1[(-1 - i)]:
                counter = counter + 1
                continue
            else:
                break
        if counter == len_l1:
            print("Is Palindrome")
        else:
            print("Is NOT Palindrome")

inp=input('Enter any number:')
s1= Solution()
s1.isPalindrome(inp)