#!/usr/bin/bash
if [[ $(whoami) == "ec2-user" ]]
then
authorized_keys_populated=$(cat ~/.ssh/authorized_keys |grep 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDCr4FMFGYs44Hu1xcw7azBPSRp8ZQUubRroA1SP+WiUL0+o3AY4aI27sajn500z2+kEzY0jzEO4DF8VwhgR5X0N2ymp/gK3dkkrFtaDIMDxdcpxxS4zAGco3D1HIx2orwvyd9SmDep9lmqu9AyCLiZ85olM4s0mU9XUskV+JGjEiEzMzkGv6i/+2C1m+h2yhk53TvPoieW2l6QZg8Wtrn+WiWYfH1P8CoKTfWxVxFBdst5risdLPtppko8xOCHNKu4azUA+PRQMZ9auYrFO85tJJANRn4XNSfNLxJ128Opt0/bM+O2W2r9H8m4ZomodtxbqOwENXGD73IIKWZTXf+OkDhOhlmFZiICtNQOF2TmETjwvWf3zOUN4tlmE9vHybqf1CizmRSr3TQQqY4OkTZVUcrJPSgGNoKQQpSRYLeUYjoz8dkwYAEgsqftcYSEDu4JDYxNnMj3ZsQS4SaGUYhYf9SjvhrGDr8/scg6GXBnYmsDWxE7P6iIrvc8IOZ08vT+jh7LBpHYSy1yl07AakluqhxI4TUE0kh/Crzi5a6R/N3YZwLSlzeC+v8Kr6qBUxMdFnVwOAyBDKvqm/WpxPAPHHtSg/4BA8V5WhwNzSXmllpeUHIXnKIeSQMI+PkIKU/I2KSsnKwkHwMTs7wfUTGwh2lLkScKHTKoLRsbVk9nsw== goelt2000@gmail.com'|wc -l)

if [[ $authorized_keys_populated -eq 1 ]]
then
echo "do nothing"
else
echo 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDCr4FMFGYs44Hu1xcw7azBPSRp8ZQUubRroA1SP+WiUL0+o3AY4aI27sajn500z2+kEzY0jzEO4DF8VwhgR5X0N2ymp/gK3dkkrFtaDIMDxdcpxxS4zAGco3D1HIx2orwvyd9SmDep9lmqu9AyCLiZ85olM4s0mU9XUskV+JGjEiEzMzkGv6i/+2C1m+h2yhk53TvPoieW2l6QZg8Wtrn+WiWYfH1P8CoKTfWxVxFBdst5risdLPtppko8xOCHNKu4azUA+PRQMZ9auYrFO85tJJANRn4XNSfNLxJ128Opt0/bM+O2W2r9H8m4ZomodtxbqOwENXGD73IIKWZTXf+OkDhOhlmFZiICtNQOF2TmETjwvWf3zOUN4tlmE9vHybqf1CizmRSr3TQQqY4OkTZVUcrJPSgGNoKQQpSRYLeUYjoz8dkwYAEgsqftcYSEDu4JDYxNnMj3ZsQS4SaGUYhYf9SjvhrGDr8/scg6GXBnYmsDWxE7P6iIrvc8IOZ08vT+jh7LBpHYSy1yl07AakluqhxI4TUE0kh/Crzi5a6R/N3YZwLSlzeC+v8Kr6qBUxMdFnVwOAyBDKvqm/WpxPAPHHtSg/4BA8V5WhwNzSXmllpeUHIXnKIeSQMI+PkIKU/I2KSsnKwkHwMTs7wfUTGwh2lLkScKHTKoLRsbVk9nsw== goelt2000@gmail.com' >> ~/.ssh/authorized_keys
fi
fi