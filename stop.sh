#!/bin/sh

container_id=`docker ps  | grep webshot | awk '{print $1}'`

docker kill $container_id