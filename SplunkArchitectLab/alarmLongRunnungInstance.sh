#!/usr/bin/bash

hoursSinceUp=$(uptime |awk '{ print $3 }'|awk -F ',' '{ print $1 }'|awk -F ':' '{ print $1 }')
minsSinceUp=$(uptime |awk '{ print $3 }'|awk -F ',' '{ print $1 }'|awk -F ':' '{ print $1 }')
if [[ $hoursSinceUp -ge 1 ]] || [[ $minsSinceUp -ge 30 ]]
then
aws sns publish --topic-arn arn:aws:sns:us-east-1:985829783879:aws_budget_ecd8d73d-91f0-4791-a03b-978e6afde7f3 --message "Stop EC2 instance $(hostname)"
echo "test"
fi