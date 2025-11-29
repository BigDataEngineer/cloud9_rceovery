#!/usr/bin/env python3
data = {
    'NFLX': 100,
    'ALPH': 300,
    'APPL': 200,
    'MSFT': 400,
    'TSLA': 220,  # Tesla
    'AMZN': 140,  # Amazon
    'GOOG': 150,  # Google (Class C)
    'NVDA': 480,  # Nvidia
    'AMD': 110,   # Advanced Micro Devices
    'BABA': 80,   # Alibaba
    'INTC': 35,   # Intel
    'CSCO': 55,   # Cisco
    'SBUX': 95,   # Starbucks
    'WMT': 160    # Walmart
}

max_value=max(data.values())
list_data=[]

for k,v in data.items():
    if v==max_value:
        list_data.append(k)
    else:
        continue

for i in list_data:
    value=data.get(i,None)
    print(f'{i}:{value}')

