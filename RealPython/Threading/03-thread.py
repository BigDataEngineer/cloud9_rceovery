import time

def myfunc(name):
    print(f'myfunc started with {name}')
    time.sleep(10)
    print('myfunc ended')
    
if __name__ == '__main__':
    print('main started')
    myfunc('realpy')
    print('main ended')