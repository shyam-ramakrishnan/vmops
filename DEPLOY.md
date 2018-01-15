## Deploy Milestone:  
  
  In our previous two milestones we established the bot's platform, interaction and service functionalities, thereby implementing all three use cases. As part of the Deploy milestone, we will be deploying our bot and relevant services onto an AWS server such that the application can be accessed by anyone. The below system architecture will be helpful in understanding our application deployment workflow:  
  
  _VMOps System Architecture_
![sedesignarch](https://media.github.ncsu.edu/user/6049/files/3a218160-9fdf-11e7-9206-39ca17d40a18)
  
  We will be utilizing two AWS servers for our deployment as shown in our architecture. For ease of understanding let's call the first server as 'AWS A' and the second server as 'AWS B'. Firstly, we will deploy our bot with all its dependancies on AWS A server using an ansible playbook. We will also install Ansible service on this server. We will then configure AWS keys, slack token, ansible host key checking and other paramters on both AWS A and B servers. Now, using Slack's client web interface we can execute commands to manage virtual machines on AWS B server.
  
### Deployment Instructions 

1) Run the 'deploy.yaml' ansible playbook on your localhost machine using the below command:  

    `ansible-playbook deploy.yaml`
    
2) SSH into the newly created EC2 instance in AWS A server to complete the below configurations  
3) Copy AWS Access key ID and AWS Secret Access Key of AWS B server. Export them as environment variables on AWS A server
4) Create an ssh-key on the AWS A instance and copy its public key. Create an AWS Key Pair on AWS B server's console and import the copied public key. 
5) Export Slack Token as an environment variable on AWS A server  
7) Export Ansible Host Key Checking as an environment variable on AWS A server and set it as FALSE.
8) Change the permissions of the repository folder on AWS A server, to create new playbooks as part of Merge functionality:

    `chmod -R 777 .`
    
### Deployment Scripts

The deployment script can be found [here](https://github.ncsu.edu/sjain11/VMOps/blob/master/Bot/deploy.yaml) 
  
### Acceptance Testing Instructions  
  
  * Our Project workspace is: https://se-project-vmops.slack.com
  * We have created a slack user for the TA's. Please use the credentials, username:tacsc510@gmail.com, password:ncsu1234
  * Our bot is called 'vmops' and it can be accessed under 'Apps' on the left column
  * Please use direct messaging to the 'vmops' bot to execute the below commands
  * Kindly refer to the screencast demo to view how the EC2 instances are affected on AWS B server's console upon executing the commands
  * _Note_: For privacy's sake, we are unable to share access credentials of our AWS B console to view the changes. However, we have demonstrated this on the screencast and, if needed, we can demonstrate it in person to the TAs. (In case access to the AWS console is really required for testing the bot, we can share it with the TAs)
    
_Use Case 1: Execute Ansible Commands on AWS server_  

1) By executing the below command, we can get the uptime of our Ansible Tower in AWS A server:

    `firecommand uptime`
    
    _Expected output:_ This should display the total time for which the Ansible Tower has been running.

2) Run the below command to get the list of running instances on AWS B server:

    `firecommand ansible --list-hosts`
    
    _Expected output:_ Bot should respond with the list of VM instances currently running on our AWS B server. Since currently  no instances are running hence the bot will reply back saying "No current instances running."

3) Run the below command to spin up a virtual machine 'vm1' (of instance type t2.large) on AWS B server:  

    `firecommand ansible-playbook AnsiblePlaybooks/vm1.yaml`
    
    _Expected output:_ The bot should respond with the output from our Ansible Tower once the ansible playbook was executed. This should list all the tasks executed.
    
4) Similarly, run the below command to spin another virtual machine 'vm2' (of instance type t2.micro) on the AWS B server:  
  
    `firecommand ansible-playbook AnsiblePlaybooks/vm2.yaml`
    
    _Expected output:_ Similarly, this would also show the output from our Ansible Tower once the ansible playbook was executed.
    
5) Run the below command to get the list of running instances on AWS B server:

    `firecommand ansible --list-hosts`
    
    _Expected output:_ Bot should respond with the list of VM instances currently running on our AWS B server. The bot will return _vm1_ and _vm2_ as currently running instances.
    

_Use Case 2: Merge virtual machines on AWS Server (package level merge)_

1) Run the below command to get the list of packages that will be installed in a new virtual machine after merging virtual machines 'vm1' and 'vm2':  

    `merged_version vm1 vm2`
    
    _Expected output:_ Here, the bot would respond with a list of packages merged from the original two virtual machines.
    
2) Now, run the below command to create a new virtual machine 'vm3' with the merged list of packages after merging virtual machines 'vm1' and 'vm2':  
  
    `merge vm1 vm2 vm3`
    
    _Expected output:_ The bot should display the output from our Ansible Tower when the new virtual machine vm3's playbook was executed. This would also list tasks executed with the merged packages. Please wait for approximately 1min to get the output displayed.   
    
    
_Use Case 3: Shrink a virtual machine on AWS Server (instance level shrink)_

1) Run the below command to get the list of instances that can be shrinked on AWS B server. We use CloudWatch to get the CPU utilization of all our instances and list those instances whose utilization is below a threshold value. So this ensures that we only shrink those VMs which are not being heavily used now:  

    `list_shrinkable`
    
    _Expected output:_ Here, the bot should give a list of instances running on AWS B server that meet the above threshold criteria.
    
2) Run the below command to get the proposed configuration of the virtual machine after it is shrinked. With the below command we will get the configuration of vm1 after performing a shrink to a lower instance type:  
  
    `shrinked_version vm1`
    
    _Expected output:_ This should display the configuration of the proposed virtual machine and the existing virtual machine.
    
3) Now, run the below command to shrink 'vm1' to its lower instance type. This process will first stop the current running vm1 instance, shrink the instance to it's lower instance level and then start the instance:

    `shrink vm1`
    
    _Expected output:_ Here, the bot would respond with the states of previous virtual machine and the shrinked virtual machine. Please wait for approximately 1min to get the output displayed.  
    
    
    _NOTE: Please refer to our screecast demo video to view how the above expected outputs are actually displayed._
  
  
### Task Tracking
We did this Milestone spanning 2 weeks. A detailed Worksheet has been created capturing our deadlines and tasks over the 2 weeks.  

The Worksheet can be found [here](https://github.ncsu.edu/sjain11/VMOps/blob/master/Worksheet_DEPLOY.md).  

The associated Trello card which we have used for Tracking can be found [here](https://trello.com/b/71hebabb/milestone-deploy).  
  
### Screencast Video

Screencast can be found [here](https://youtu.be/A9YX-vNIL40)  
  
### Previous Milestone Readme Submission Links:

DESIGN milestone readme can be found [here](https://github.ncsu.edu/sjain11/VMOps/blob/master/DESIGN.md)  
BOT milestone readme can be found [here](https://github.ncsu.edu/sjain11/VMOps/blob/master/BOT.md)  
SERVICE milestone readme can be found [here](https://github.ncsu.edu/sjain11/VMOps/blob/master/SERVICE.md)  
