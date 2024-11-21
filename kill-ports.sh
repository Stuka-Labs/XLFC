#!/bin/sh
lsof -n -i4TCP:8081| grep LISTEN | awk '{ print $2 }' | xargs kill -9