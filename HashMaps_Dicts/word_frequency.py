#!/usr/bin/python3

str_inp='This this an an is an example. example.'
str_list=str_inp.split()
dict_out={}

for i in str_list:
    if dict_out.get(i,None):
        dict_out[i]=dict_out[i]+1
    else:
        dict_out[i]=1
print(dict_out)