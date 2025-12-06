#!/usr/bin/env python3
from collections import Counter


file=input('Provide file path:')
f_handle=open(file,'r')

word_list=[]
for line in f_handle:
    line=line.strip()
    words=line.split()
    word_list.extend(words)

# print(word_list)

dict_histogram_words=Counter(word_list)
# print(dict_histogram_words)

max_occured_word, value_max=dict_histogram_words.most_common(1)[0]
print(f'{max_occured_word}:{value_max}')

word_list_max_occurence=[]
for k,v in dict_histogram_words.items():
    if v == value_max:
        word_list_max_occurence.append(k)

print(f'{value_max}: {word_list_max_occurence}')








