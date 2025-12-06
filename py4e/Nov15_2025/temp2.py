#!/usr/bin/env python3
from collections import Counter

multiline_string_single='''Writing programs or programming is a very creative
and rewarding activity  You can write programs for
many reasons ranging from making your living to solving
a difficult data analysis problem to having fun to helping
someone else solve a problem  This book assumes that
{\em everyone} needs to know how to program and that once
you know how to program, you will figure out what you want
to do with your newfound skills

We are surrounded in our daily lives with computers ranging
from laptops to cell phones  We can think of these computers
as our personal assistants who can take care of many things
on our behalf  The hardware in our current-day computers
is essentially built to continuously ask us the question
What would you like me to do next
dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy 
Our computers are fast and have vasts amounts of memory and 
could be very helpful to us if we only knew the language to 
speak to explain to the computer what we would like it to 
do next If we knew this language we could tell the 
computer to do tasks on our behalf that were reptitive  
Interestingly, the kinds of things computers can do best
are often the kinds of things that we humans find boring
and mind-numbing
'''

# lines=multiline_string_single.splitlines()
# word_list=[]
# for line in lines:
#     line=line.strip()
#     words=line.split()
#     word_list.extend(words)

file=input('Enter file path:')
f_handle=open(file, 'r')
word_list=[]
for line in f_handle:
    line=line.strip()
    words=line.split()
    word_list.extend(words)



dict_hist=Counter(word_list)
key, value_max=dict_hist.most_common(1)[0]

word_list_max_occurence=[]

for k,v in dict_hist.items():
    if v == value_max:
        word_list_max_occurence.append(k)

print(f'max occurence: {value_max}')
print(f'word_list_max_occurence: {word_list_max_occurence}')



