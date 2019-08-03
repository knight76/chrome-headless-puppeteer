#!/bin/sh

docker build -t webshot .

docker run  -p 3000:3000 webshot

