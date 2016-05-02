#!/bin/bash

## Puts a large query logs that is sorted in buckets (configurable)

[[ $1 ]] || { echo "Give a number of files to split the query logs into as a first argument, and a directory to put the files into as the second"; exit ; }
[[ $2 ]] || { echo "Give a directory to put the files into as the second argument"; exit ; }

mkdir $2; 

count=0;

while read a ; do {
	echo $a  >> $2/$count.jsonstream;
	count=$(( (count+1)%$1 ));
} done
