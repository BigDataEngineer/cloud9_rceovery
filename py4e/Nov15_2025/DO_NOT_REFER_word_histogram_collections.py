#!/usr/bin/env python3

from collections import Counter
import string

file=input('Give file path:')
f_handle=open(file,'r')

with open(file, 'r') as file:
    all_words = []
    
    for line in file:
        # 1. Clean and split the line
        line = line.strip().lower()
        
        # 2. Tokenize (split into words)
        words = line.split() 
        
        # 3. Add to the list (or process directly, but list is often clearer)
        all_words.extend(words)

# 4. Create the histogram in a single, highly optimized line
#    This replaces the entire manual 'for l in word list...' loop.
dict_hist = Counter(all_words)

# Assuming dict_hist is now a Counter object

# 1. Get the single most common item (a list containing one (word, count) tuple)
most_common_tuple = dict_hist.most_common(1) 

if most_common_tuple:
    # Unpack the max count
    max_word, value_max = most_common_tuple[0]
    
    # 2. To get *all* words with that count, we can iterate:
    list_max_occurrence_keys = []
    for word, count in dict_hist.items():
        if count == value_max:
            list_max_occurrence_keys.append(word)

    # 3. Output
    print(f"\nMaximum Occurrence Count: {value_max}")
    print(f"Words with Max Count: {list_max_occurrence_keys}")
