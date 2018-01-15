import boto
import boto.ec2
from boto.ec2.regioninfo import RegionInfo
import os
import sys

port=80
access_id = os.environ['AWS_ACCESS_KEY_ID']
access_secret = os.environ['AWS_SECRET_ACCESS_KEY']

region_name = "us-east-1"
region_endpoint = "apigateway.us-east-1.amazonaws.com"

# first create a region object and connection
region = RegionInfo(name=region_name, endpoint=region_endpoint)
ec2conn =  boto.connect_ec2(access_id, access_secret, port=port, region=region)

reservations = ec2conn.get_all_instances()
instances = [i for r in reservations for i in r.instances]
for i in instances:
    pprint(i.__dict__)