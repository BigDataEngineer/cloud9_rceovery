import sys

try:
    range_inp=int(input('Enter range:'))
except:
    print('Please enter positive integers only.')
    sys.exit(1)
    
# find all the pairs of a,b,c,d such that a**3 * b**3 == c**3 * d**3

for a in range(1,range_inp+1):
    for b in range(1,range_inp+1):
        for c in range(1,range_inp+1):
            for d in range(1,range_inp+1):
                if (a**3 * b**3) == (c**3 * d**3):
                    print(a,b,c,d)
                else:
                    continue
                
    
    