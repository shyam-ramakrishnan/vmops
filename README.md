## VMOps

VMOps is a reactor bot implemented in Slack to automate VM operations in AWS servers using Ansible. Primary users would be DevOps engineers who are familiar with configuration management and scaling AWS EC2 instances.

**Problems solved by the Bot:**

1) Deploying Configurations of Virtual Machine instances in AWS servers which otherwise would have to be done manually. This saves time and effort of DevOps engineers.  
2) A centralized UI(Slack) to interact with VMs in different AWS servers and availability regions. The engineers won't have to SSH into the individual VM instance and thus reduces complexity.  
3) Ability to shrink under-utilized VMs. This incorporates efficient utilization of the resources in our remote server.  
4) Ability to merge two VMs on package level to spawn a new VM. So that engineers do not have to spend time installing all packages if there's a need to combine VM instances.

**Bot Architecture:**

![sedesignarch](https://media.github.ncsu.edu/user/6049/files/3a218160-9fdf-11e7-9206-39ca17d40a18)

### Use Cases and Screens:
  
Primary features of the bot are:  
1) Users can execute ansible commands on an AWS server and perform operations like spinning up configurable virtual machine instances, getting list of instances running on the AWS server and getting uptime for the ansible tower.  
2) Ability to merge two virtual machines running on the server by merging their respective list of packages and creating a new virtual machine with merged packages.  
3) Ability to shrink a virtual machine instance on the server to a lower configurable instance such that there is optimum resource consumption by virtual machines.  
  
  _Use Case 1: Execute Ansible Commands on AWS server_  

1) Users can get the uptime of the Ansible Tower by executing the below command:

    `firecommand uptime`
    
    _For Example:_  
      
      <img width="1241" alt="screen shot 2017-12-03 at 3 13 51 pm" src="https://media.github.ncsu.edu/user/6108/files/51b7b196-d842-11e7-8fac-ac8efa710a83">

2) Users can get the list of running instances on AWS server using the below command:

    `firecommand ansible --list-hosts`
    
    _For Example:_  
    
    <img width="1227" alt="screen shot 2017-12-03 at 3 16 51 pm" src="https://media.github.ncsu.edu/user/6108/files/f5744bd2-d842-11e7-9753-113bca7d6aaa">


3) Users can spin up configurable virtual machines using pre-written ansible playbooks. To spin a virtual machine named 'vm1' on the server below command can be executed:  

    `firecommand ansible-playbook AnsiblePlaybooks/vm1.yaml`
    
    _For Example:_  
      
      <img width="1238" alt="screen shot 2017-12-03 at 3 15 56 pm" src="https://media.github.ncsu.edu/user/6108/files/c2820b42-d842-11e7-8df9-a918004efd59">
    
    On AWS server:
    
    <img width="1383" alt="screen shot 2017-12-03 at 3 16 05 pm" src="https://media.github.ncsu.edu/user/6108/files/e1ae5822-d842-11e7-9aa8-add952911d4e">
    
  
_Use Case 2: Merge virtual machines on Package Level_

1) Users can get the list of packages that will be installed in the merged virtual machine after combining packages of two virtual machines using the below command:  

    `merged_version vm1 vm2`
    
    _For Example:_  
    
    <img width="1234" alt="screen shot 2017-12-03 at 3 17 49 pm" src="https://media.github.ncsu.edu/user/6108/files/88dc334e-d843-11e7-993a-c92b62ceb172">

    
2) Users can merge two virtual machines if they're satisfied with the merged list of packages using the below command:  
  
    `merge vm1 vm2 vm3`
    
    _For Example:_  
    
    <img width="1219" alt="screen shot 2017-12-03 at 3 31 03 pm" src="https://media.github.ncsu.edu/user/6108/files/9a58d0b4-d843-11e7-889a-6500cbbcf760">  
    Output:  
    <img width="1234" alt="screen shot 2017-12-03 at 3 31 10 pm" src="https://media.github.ncsu.edu/user/6108/files/ac796f24-d843-11e7-94f1-bc9165dad720">
    
    On AWS server:
    <img width="1384" alt="screen shot 2017-12-03 at 3 30 20 pm" src="https://media.github.ncsu.edu/user/6108/files/5ac2cd0a-d844-11e7-8248-b0e1ff47b5f8">


_Use Case 3: Shrink a virtual machine on AWS Server_

1) CloudWatch CPU utilization metrics are used to evaluate which of the running instances can be shrinked. Users can get the list of instances that can be shrinked on AWS server using the below command:  

    `list_shrinkable`
    
    _For Example:_  
    
    <img width="1229" alt="screen shot 2017-12-03 at 3 31 44 pm" src="https://media.github.ncsu.edu/user/6108/files/212437c8-d844-11e7-9775-1899386fcbf8">
    
2) Users can get the proposed configuration of the virtual machine after it is shrinked using the below:  
  
    `shrinked_version vm1`
    
    _For Example:_  
    
    <img width="1227" alt="screen shot 2017-12-03 at 3 32 04 pm" src="https://media.github.ncsu.edu/user/6108/files/c840be24-d843-11e7-9909-5a2276586eb8">

    
3) When the user has decided which virtual machine to shrink and is satisfied with the proposed instance configuration, they shrink a virtual m achine using the below command:  

    `shrink vm1`
    
    _For Example:_  
    
    <img width="1227" alt="screen shot 2017-12-03 at 3 32 48 pm" src="https://media.github.ncsu.edu/user/6108/files/d324c664-d843-11e7-8663-f90e4d1a58fb">  
    
    On AWS server:  
    <img width="1379" alt="screen shot 2017-12-03 at 3 33 01 pm" src="https://media.github.ncsu.edu/user/6108/files/f00f3e94-d843-11e7-8d2f-8949a3ae2376">


