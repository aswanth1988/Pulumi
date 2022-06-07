import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

//import { config } from "process";
let con=new pulumi.Config();
const temp=con.get("instance_type")

// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.Bucket("sample");

// Export the name of the bucket
export const bucketName = bucket.id;

// Copyright 2016-2021, Pulumi Corporation.  All rights reserved.




// Get the id for the latest Amazon Linux AMI
const ami = aws.ec2.getAmi({
    filters: [
        { name: "name", values: ["amzn-ami-hvm-*-x86_64-ebs"] },
    ],
    owners: ["137112412989"], // Amazon
    mostRecent: true,
}).then(result => result.id);

// create a new security group for port 80
const group = new aws.ec2.SecurityGroup("web-secgrp", {
    ingress: [
        { protocol: "tcp", fromPort: 80, toPort: 80, cidrBlocks: ["0.0.0.0/0"] },
    ],
});

const server = new aws.ec2.Instance("web-server-www", {
    tags: { "Name":"Dev"},
    instanceType: temp, // t2.micro is available in the AWS free tier
    vpcSecurityGroupIds: [ group.id ], // reference the group object above
    ami: ami,
        
    
             // start a simple web server
});
export const publicIp = server.publicIp;
export const publicHostName = server.publicDns;

