#!/usr/bin/bash
cd /home/ec2-user/cloud9_rceovery
git add .
git commit -m "$(date +%s)"
git push -u origin master
echo $?