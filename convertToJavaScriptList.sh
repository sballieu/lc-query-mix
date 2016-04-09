#!/bin/bash

echo 'var queries = ['
sort -k2 -t ':' -n $1 | sed 's/}/},/g' | sed '$ s/},/}/g' | sed 's/http:\/\/irail.be\/stations\/NMBS\/00//g'
echo '];'
