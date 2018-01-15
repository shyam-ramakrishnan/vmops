# SERVICE.md

In the previous BOT milestone, we described 3 use cases and implemented interaction with the bot with the help of mocking data and services. In the SERVICE milestone, we have implemented these 3 use cases using ansible, ec2 modules and ansible API that provides interface with EC2.

Following is the summary of the SERVICE MILESTONE

## Use - Cases

PLease refer to the BOT milestone readme [here](https://github.ncsu.edu/sjain11/VMOps/blob/master/BOT.md). The use cases are as per the previous Milestone and no change.  

## Bot Use-Case Implementation:

### Introduction and bot helper functions:
We have implemented the services on Amazon EC2 instances. Ansible is runnning on our local machine and the vm's are being deployed in AWS server. In the next stage(Deploy milestone) we will be running the ansible and slackbot in one EC2 instance and all the services will be on AWS server.

To implement our use cases, we have written several helper functions in our main code file [VMOps.js](https://github.ncsu.edu/sjain11/VMOps/blob/master/Bot/vmops.js)  

#### A. getListOfInstances():

This function provides the current instances list deployed from our Ansible VM. It uses the Ansible-EC2 module and gets back with information about the list of VMs(instances) that are currently active and running. We are using this function in our Use case 1.  

#### B. checkinput():

This function does validation of user input. Depending on the keyword entered we store it in list with a validation flag _true_ or _false_. Inside our use case functions this is first checked and if its correct then the use case proceeds otherwise we output the error message on Slack bot.  

#### C. getExactCount():

This function provides the exactCount of the specified filename from its Ansible playbook. For example if _vm1_ is up and running this would return _1_. So, if we want to terminate _vm1_ then this _exactCount_ needs to be made _0_.
 
#### D. get_instance_type():

This function provides the _instance_type_ of the provided VM. Every VM in Amazon EC2 is characterized as _Large_, _Medium_, _Small_, _Micro_, _Nano_ etc. This characterization is important as the resources given to a VM are based on this. Our use case 2 and 3 where we are merging and shrinking the VMs plays with this _instance_type_.

#### E. get_tasks():

This function provides the current instances packages installed. This is used in use case 2, since we are merging and shrinking VMs on basis of the packages installed in them.

### Use-Case 1:  

The use case 1 let's us push ansible commands from the slack bot and see their output on slack. This is particularly helpful for Ansible developer on Slack as he doesn't need to go out of the slack bot. This can help in executing ansible commands like spinning up a new VM, terminating a VM, getting list of hosts, uptime etc.  

### Use-Case 2:  

The use case 2 let's us merge 2 VMs on packages level. One first needs to get the list of instances available. Then the user will be presented with data of instance_type and the packages installed in them. The user can then select if he/she wants to merge the VMs or not. If the user selects to merge say _vm1_ and _vm2_ then our bot via ansible will spin up an third VM _vm3_ which is esentially the merge of _vm1_ and _vm2_ based on package level.

### Use-Case 3:  

The use case 3 let's us shrink 2 VMs. One first needs to get the list of instances available. This functionality also helps provide whether a particular VM is shrinkable or not. Once it is, our bot will provide a configuration of the VM after it will be shrinked. Shrink is achieved on basis of changing the _instance_type_ of the already existing VM. The user now can confirm if this shrink configuration is acceptable and once the user types in _shrink vm1_ the VM will be shrinked.

## Bot Implemented Use-Case's Testing: 

1) We have done rigorous testing on our bot by running all the test cases individually and by running all the commands in order. And the output was as expected.  
2) We have tested the bot by running the wrong commands to see if the bot handles the error cases. As per expectation the incorrect commands were caught and appropriate suggestion were given as the output by the bot. For example if the user gives the command "firecommand uptim" instead of "firecommand uptime" the bot replies back "Please try the command: firecommand uptime".     
3) We have also run the commands in the reverse order to see if the bot can handle the alternate flows. And the bot runs all the commands which do not require dependencies and gives a suggestion for the commands which require the previous commands to be fired. 


## Task-Tracking:

We did this Milestone spanning 2 weeks. A detailed Worksheet has been created capturing our deadlines and tasks over the 2 weeks.

The Worksheet can be found [here](https://github.ncsu.edu/sjain11/VMOps/blob/master/Worksheet_SERVICE.md)  
The associated Trello card which we have used for Tracking can be found [here](https://trello.com/b/LYQ7ZuWV/milestone-service)  

## Screencast:

Screencast can be found [here](https://www.youtube.com/watch?v=fknYlqbpMDE)  

## Previous Milestone Readme Submission Links:

The design milestone readme can be found [here](https://github.ncsu.edu/sjain11/VMOps/blob/master/DESIGN.md)  
The bot milestone readme can be found [here](https://github.ncsu.edu/sjain11/VMOps/blob/master/BOT.md)  
