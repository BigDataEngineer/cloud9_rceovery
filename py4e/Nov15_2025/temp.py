#!/usr/bin/env python3

import requests
from ratelimit import limits, RateLimitException, sleep_and_retry

ONE_MINUTE = 60
MAX_CALLS_PER_MINUTE = 30

@sleep_and_retry
@limits(calls=MAX_CALLS_PER_MINUTE, period=ONE_MINUTE)
def access_rate_limited_api(count):
    resp = requests.get('http://localhost/')
    print(f"{count}.{resp.text}")    

for i in range(60):
    access_rate_limited_api(i)

# def access_rate_limited_api(count):
#     resp = requests.get('http://localhost/')
#     print(f"{count}.{resp.text}")    

# for i in range(60):
#     access_rate_limited_api(i)

# def reference():
#     def inner():
#         return 42
#     return inner

# def evaluation():
#     def inner():
#         return 42
#     return inner()

# referenced = reference()
# evaluated = evaluation()
# print(f'referenced: {referenced}, evaluated: {evaluated} ')