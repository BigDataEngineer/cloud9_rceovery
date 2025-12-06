#!/usr/bin/env python3
import collections

file=input('Enter file path:')
f_handle=open(file,'r')

word_list=[]
for line in f_handle:
    line=line.strip()
    words=line.split()
    word_list.extend(words)

dict_hist=collections.Counter(word_list)
word, max_value=dict_hist.most_common(1)[0]

k_list=[]
for k, v in dict_hist.items():
    if v==max_value:
        k_list.append(k)

print(f'max_value is {max_value}, words having max_value: {k_list}')

        

