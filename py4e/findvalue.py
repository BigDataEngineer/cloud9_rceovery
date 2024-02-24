import sys
usr_input=input("Enter a number: ")
try:
    usr_input=int(usr_input)
except:
    print("Please enter a number.")
    sys.exit(1)
found=False
for i in [2,3,4,5,12,34,32]:
    if i==usr_input:
        found=True    
        print("Found the value in the list")
        break
    else:
        print("continuing...")
        
    
    