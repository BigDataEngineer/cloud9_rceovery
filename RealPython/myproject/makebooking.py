#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import time
import pprint
pp = pprint.PrettyPrinter(indent=4)
import requests
import json
from datetime import datetime

DEV_FORCE_BOOKING = False
DATE_DELAY = 0 # 0 would be the first available date,, but it could also be the same day as today
TIME_SLOT = -1 # last slot one in the day
BASE_URL = 'https://publicapi.txdpsscheduler.com/api/'

# change these details to your personal information to book
DOB = "12/18/1984"
FIRST_NAME = 'Tusha'
LAST_NAME = 'Goel'
EMAIL = 'goelt2000@gmail.com'
LAST_4 = '1458'

SERVICE_TYPE = 71
DATE_PATTERN = '%m/%d/%Y'

# these are the needed headers to communicate with the scheduler apis
HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36',
  'Referer': 'https://public.txdpsscheduler.com/',
  'Origin': 'https://public.txdpsscheduler.com',
  'Host': 'publicapi.txdpsscheduler.com',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Encoding': 'gzip, deflate, br',
  'Content-Type': 'application/json',
  'Cookie': 'ARRAffinity=bbe667b6ac7363554ad0781245985818906290e4fd0c62146e63586c6747a1f4; ARRAffinitySameSite=bbe667b6ac7363554ad0781245985818906290e4fd0c62146e63586c6747a1f4'
}

def get_soonest_date_from_locations(results):
  da_soonest = None
  for location in results:
    print('{} with Id={}, Soonest={}, Distance={}'.format(location.get('Name'), location.get('Id'), location.get('NextAvailableDate'), location.get('Distance')))

    compare_date = datetime.strptime(location.get('NextAvailableDate'), DATE_PATTERN)
    if da_soonest and (da_soonest.get('next_date') < compare_date):
      continue
    if da_soonest and (da_soonest.get('next_date') == compare_date) and \
      da_soonest.get('distance') <= location.get('Distance'):
      # print('date is equal and distance is less or equal')
      continue
    da_soonest = {
      'id': location.get('Id'),
      'next_date': datetime.strptime(location.get('NextAvailableDate'), DATE_PATTERN),
      'distance': location.get('Distance')
    }
  print("test")    
  return da_soonest


def get_response_id():
  # make sure we are eligible:
  ELIGIBILITY_URL = BASE_URL + 'Eligibility'
  PAYLOAD = json.dumps({
    "CardNumber": "",
    "DateOfBirth": DOB,
    "FirstName": FIRST_NAME,
    "LastFourDigitsSsn": LAST_4,
    "LastName": LAST_NAME
  })

  response = requests.request('POST', ELIGIBILITY_URL, headers=HEADERS, data=PAYLOAD)
  results = response.json()
  return results[0].get('ResponseId')


def get_bookings():
  PAYLOAD = json.dumps({
    "DateOfBirth": DOB,
    "FirstName": FIRST_NAME,
    "LastFourDigitsSsn": LAST_4,
    "LastName": LAST_NAME
  })
  BOOKING_URL = BASE_URL + 'Booking'
  response = requests.request('POST', BOOKING_URL, headers=HEADERS, data=PAYLOAD)
  return response.json()


def make_booking_request(last_slot_of_earliest_day, response_id, da_soonest):
  MAKE_BOOKING_URL = BASE_URL + 'RescheduleBooking'
  MAKE_BOOKING_BODY = json.dumps({
    'BookingDateTime': last_slot_of_earliest_day.get('StartDateTime'),
    'BookingDuration': last_slot_of_earliest_day.get('Duration'),
    'CardNumber': "",
    'CellPhone': "",
    'DateOfBirth': DOB,
    'Email': EMAIL,
    'FirstName': FIRST_NAME,
    'HomePhone': "",
    'Last4Ssn': LAST_4,
    'LastName': LAST_NAME,
    # where is this from?
    'ResponseId': response_id,
    'SendSms': False,
    'ServiceTypeId': SERVICE_TYPE,
    'SiteId': da_soonest.get('id'),
    'SpanishLanguage': "N"
  })
  print(MAKE_BOOKING_BODY)
  response = requests.request('POST', MAKE_BOOKING_URL, headers=HEADERS, data=MAKE_BOOKING_BODY)
  return response.json()
  # return None


def get_available_locations():
  PAYLOAD = json.dumps({
      "CityName": "",
      "PreferredDay": 1,
      "TypeId": 71,
      "ZipCode": "78723"
  })
  URL = BASE_URL + 'AvailableLocation'
  response = requests.request('POST', URL, headers=HEADERS, data=PAYLOAD)
  print(response.json())


def hold_slot_request(slot_id):
  HOLD_SLOT_URL = BASE_URL + 'HoldSlot'
  PAYLOAD = json.dumps({
    "DateOfBirth": DOB,
    "FirstName": FIRST_NAME,
    "Last4Ssn": LAST_4,
    "LastName": LAST_NAME,
    "SlotId": slot_id
  })

  print('\nHOLD_SLOT payload: ', PAYLOAD, '\n')
  response = requests.request('POST', HOLD_SLOT_URL, headers=HEADERS, data=PAYLOAD)
  return response.json()


def __main__():
    results = get_available_locations()
    print(results)
  

__main__()


# How to Use:
# set this script on a a cronjob running every X minutes
# python3 makebooking.py