#!/usr/bin/env python3
import time
from concurrent.futures import ThreadPoolExecutor as PoolExecutor
from datetime import datetime

class Solution:
    def slow_func(self, thread_count) -> None:
        now=datetime.now()
        print(f'Thread # {thread_count} started at {now}')
        time.sleep(5)
        now=datetime.now()
        print(f'Thread # {thread_count} completed after waiting 5 seconds at {now}')
    
if __name__=='__main__':
    sol1=Solution()
    with PoolExecutor(max_workers=3) as executor:
        for _ in executor.map(sol1.slow_func, range(10)):
            pass



