#!/usr/bin/env python3

'''
"Using Python, analyze a sample text to identify the term frequencies of non-stop words (keywords). The program should then report the 10 terms with the highest occurrence count."

dict2={'fields1': 100 , 'field2':50}

Histogram steps
define file handle and open the file in read mode which needs to be parsed.
parse each line
strip each line
split each line to get a list of words
create a dictionary such that { 'word1': occurrence count, 'word2':occurrence count}
for l in word list, dict_hist['l']=dict_hist.get('l',0)+1
work on the dictionary created
value_max=max(dict_hist.values())
create empty list to contain all the keys which have the highest occurnce count
list_max_occurence_keys=[]
for k, v in dict_hist.items(): if v=value_max list_max_occurence_keys.append(k)
parse the list items in list_max_occurence_keys and print the key, value pair
for I in list_max_occurence_keys: value=dict_hist.get('l',0) prindt (l, value)
'''

# class Solution:
#     def histogram(self,x):

# f_handle=open('/Users/Surface/Documents/Learning/cloud9_rceovery/py4e/Nov15_2025/alpha_vantage_globalquote_func.py','r')

file=input('Give file path:')
f_handle=open(file,'r')

dict_hist={}
for line in f_handle:
    line=line.strip()
    list_words=line.split()
    print(list_words)
    for word in list_words:
        dict_hist[word]=dict_hist.get(word,0)+1


max_dict_hist=max(dict_hist.values())
dict_temp={}

list_max_occurence_term=[]
for k,v in dict_hist.items():
    if v == max_dict_hist:
        max_occurence_term=k
        list_max_occurence_term.append(max_occurence_term)
    else:
        continue

for i in list_max_occurence_term:
    value=dict_hist.get(i)
    print(f'max_occurence_terms:, {i}: {value}') 






        


