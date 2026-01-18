#!/usr/bin/env python3
import time
from concurrent.futures import ThreadPoolExecutor as PoolExecutor
from datetime import datetime

class Solution:
    def slow_func(self, thread_count: int) -> None:
        now = datetime.now()
        
             
        print(f'Thread {thread_count} started at ({now})')
        
        # The I/O-bound part where the thread waits
        time.sleep(5) 
        
        now = datetime.now()
        print(f'Thread {thread_count} completed after waiting 5 seconds at ({now})')
    
if __name__=='__main__':
    sol1 = Solution()
    # Define a pool with a max of 3 concurrent threads
    with PoolExecutor(max_workers=3) as executor:
        # Map the function (sol1.slow_func) to the iterable (range(10))
        # This creates 10 tasks, passing the numbers 0 through 9 to slow_func.
        for _ in executor.map(sol1.slow_func, range(10)):
            pass
