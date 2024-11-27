#!/usr/bin/python3

fout=open('outfile.txt','w')
type(fout)
print(fout)
line1='first line\n'
fout.write(line1)
fout.write('second line\n')