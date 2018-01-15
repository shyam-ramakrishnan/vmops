# Design Milestone

### Problem Statement:

> Have you had problems while deploying configurations on your VMs? Ever thought of being able to do that without even remotely logging into them? How about controlling your VMs from Slack? To be able to monitor them, get their status, list of packages in them and on top of that to be able to control resource utilization for each VM. If you want an efficient and an easy to use solution for all these problems then this is the Slack bot you are looking for.  

> A common software engineering problem that software developers face these days is the lack of ablility to continuously manage various tools at their workplace along with daily interaction with teammates (say via Slack). If one have multiple VMs deployed and is trying to managing them manually, it can be inefficient, time consuming and inconvenient to manage all of them manually. Here are some current software engineering challenges which our bot aims to alleviate:  

> * To manually remote into your VMs to check its status (say for ex. CPU stats).  
> * To analyze the output from the VM and make appropriate decisions.  
> * To continuously manage your VMs on a granular level in terms of the packages/applications your VMs support.  
> * Make modifications in the packages/applications inside your VMs to maximize resource utilization of your VM. It will also help to bring down TCO for your deployed VMs.  
> * Problems when user needs an application to run packages across multiple VMs (VM merge) and also when it is desired to reduce resources (VM shrink) occupied by a VM to prevent wastage.  
> * Every team member querying the VM separately for information thus reducing efficiency.  

> Our bot *VMOps* focuses on the above problems and provides an integrated solution to the above four challenges right inside Slack.  

### Bot Description:  

> This section gives a description to our bot which solves the problem described in the previous section. VMOps is a reactor bot working as DevOps bot implemented in Slack that will help solve the above problem by directly taking the ansible commands from the slack console and run that command on the ansible server(VM). The user doesn’t need to ssh to the server and run the ansible commands, the slack bot does it for the user. Our bot, also fetches the output of these commands and displays it in the slack channel. Hence, our slack bot acts as a wrapper doing all the heavy lifting and providing a user friendly interface. 


> The second use case of our bot is to give an option to create a new VM by merging packages of two VMs. The new merged VM will be the next available higher EC2 instance type.  The user will request to merge two VMs. Our bot queries the VMs for the list of packages installed in two VMs. This is done by extracting the package list from the yaml playbook of each VM. Our bot creates a new yaml playbook consisting the union of packages from both VMs and returns the union of packages to the user for the approval. Once the user gives the approval our bot will create a new VM with the union of these packages and gives a successful build message to the user. If a package has two different versions in different VMs then we will use the latest version. This helps a developer to use packages installed in different VMs for specific applications.     

> The third use case of our bot is to shrink a VM. The user will query the bot to give details about the current memory/processor consumption of the VM. And if the user wishes to shrink the VM, he can just provide the command with the new memory and core requirements to the bot and the bot will shrink the VM and conserve the memory/processor of the server.  

> Shrinking the instance in AWS means changing the EC2 type of the instance. The bot will suggest new instance type and display the properties of the suggested EC2 instance type.  

> The possible issues with VM shrinking and the proposed solutions:

1. How to handle if User commands to shrink a VM which should/could not be shrunk further?  
    i.e. the VM is using its full assigned capacity.  
Solution: The user will be provided with the list of VMs he/she can shrink. The user can view the possible shrinkable version of a particular VM. If user requests to shrink a VM which is not in the list of shrinkable VMs then the bot will not shrink VM. The use case to take input from a user for custom size for VM is out of scope for this project.  

2. Do we have to take the instance down for shrinking?  
Solution: Yes, We have to stop and restart the instance for shrinking. The downtime planning will not be Bots responsibility. For this, we may add features like scheduling shrinking of particular VMs.  

3. Would we lose data after shrinking the instance?  
Solution: Yes, we might lose data after shrinking the instance. The bot will take care of this issue by taking EBS snapshot before shutting down the instance for resizing. After resizing, we will restore this snapshot to the shrunk instance.  

4. Would the IP address change after resizing it?  
Solution: The IP address will change if the instance is running in the EC2 virtual private network. This can be taken care by assigning an Elastic IP address to the instance. Also not all IP address changes are important to us as EBS would take care of internal server's IP address changes.  

5. Will the resizing ensure the shrunken VM is as efficient and consistent as the original VM in terms of services?
Solution: We can perform health checks on the shrunk version of the EC2 instance and notify the user if it has failed or succeeded in it. The revert functionality is not in the scope of this project but we may(would like to) do it.  
 



### Use Cases: 

#### 	Use Case 1: Execute shell commands in the VM through the bot. 
##### 1. Preconditions : 
> Ansible is running in a VM and the bot has remote access to the ansible VM. The infrastructure VMs have unique hostnames. 
##### 2. Main Flow:
> User will request for an Ansible command to be executed on the ansible control machine[S1]. The bot will return the output of the shell command[S2].
##### 3. Subflows:  
> **S1**: User sends an Ansible command to be executed on Ansible control machine like running playbook, listing current servers in playbooks.  
> **S2**: The bot returns the output of the command executed.
##### 4.  Alternative flows : 
> **E1**: The command is invalid.  
> **E2**: The bot is unable to return the output.  
> **E3**: Failure in the command execution 


#### 	Use Case 2: Merge 2 VMs. 
##### 1. Preconditions : 
> The 2 VMs are successfully running on the server and have unique hostnames
##### 2. Main Flow: 
> User will request to merge 2 VMs[S1]. Bot will return the list of packages installed on the 2 VMs that will be installed on the new VM and User will confirm the list.[S2]. The use case ends when the bot returns the build successful status[S3].
##### 3. Subflows: 
> **S1**: User provides merge command along with the hostname of the 2 VMs.   
> **S2**: Bot returns the cumulative list of packages that will be installed on the new VM. User confirms the list with the merge deploy command.   
> **S3**: Bot returns the build successful status.   
##### 4. Alternative flows:
> **E1**: The bot returns build failure status.  
> **E2**: The hostname provided does not exist.  

#### 	Use Case 3: Shrink a VM. 

##### 1. Preconditions: 
> The VM is successfully running on the server and has a unique hostname. 
##### 2. Main Flow: 
> User will request for list of shrinkable VMs. Bot will return that list[S1]. User selects the VM with the hostname and requests the bot for possible shrink configurations. Bot will return the possible shrunken configuration[S2]. User will then send the shrink command if he deems the configuration to be correct.[S3].The use case ends when the bot returns the build successful status[S4].
##### 3. Subflows: 
> **S1**: User asks for a list of possible shrinkable VMs. Bot returns the list.    
> **S2**: User selects a VM and requests for possible shrink configuration for the VM. Bot returns the possible configurations of the VM.   
> **S3**: If user finds the new configurations plausible, user sends the shrink command.   
> **S4** : Bot returns the build successful status.   
##### 4.  Alternative flows:
> **E1**: The bot returns build failure status.   
> **E2**: There are no possible shrinkable VMs.  

### Design Sketches

#### Slack Bot Wireframe

![wireframe](https://media.github.ncsu.edu/user/6108/files/75c0f9d2-9fe7-11e7-8c56-ee546d887f7a)

> This is a simple wireframe of the Slack UI where DevOps engineers can accomplish tasks with VMOps bot.

#### Storyboard
<img src="https://media.github.ncsu.edu/user/6108/files/b878640e-9fe7-11e7-959f-83f2fffdbcee" width="600" />

> Users can perform operations like executing an ansible playbook, merging two virtual machines and shrinking a virtual machine through the VMOps bot. Let us look at these scenarios in detail:

##### Execute one-line Ansible operations through the Bot

<img src="https://media.github.ncsu.edu/user/6108/files/945226dc-9fe7-11e7-905d-faf72d95c1bc" width="600" />

> DevOps engineers can execute short ansible playbook commands directly through the slack bot to perform operations like spinning up VMs, rolling updates to VMs, getting VM statistics, etc.

##### Merge two Virtual Machines

<img src="https://media.github.ncsu.edu/user/6108/files/c858b20c-9fe7-11e7-922c-6954682a3d43" width="600" />

> In order to merge two VMs, users can get a list of VMs and check the proposed configuration of merging two specific VMs. If the configurations look feasible, they can execute 'merge vm_name1 vm_name2 -a 'new_vm' to merge the two VMs.

##### Shrink a Virtual Machine

<img src="https://media.github.ncsu.edu/user/6108/files/9e8f6ea2-9fe7-11e7-8dc4-2ec3f0131e69" width="600" />

> Users can also get a list of shrinkable VMs and check their proposed configuration before executing the shrink operation. If the configurations look good, users can then execute 'shrink vm_name3' to shrink the virtual machine, vm_name3.

### Architecture Design
![sedesignarch](https://media.github.ncsu.edu/user/6049/files/3a218160-9fdf-11e7-9206-39ca17d40a18)
> Above image depicts the proposed design architecture. In our design, we have three main parts viz. Application Interface, VMOps and Ansible, and AWS EC2 instances.

#### Application Interface - Users and Slack:
> Users will communicate with our bot through Slack which can be accessed through either a web application or the desktop based application. The users will command the bot by mentioning its name(@VMOps) at the start of the command. 

#### AWS EC2 - VMOps Bot and Ansible:
> Our bot will be running on AWS EC2 instance where we will also keep ansible engine. We will be keeping this on a public IP so that anyone with the right credentials can access VMOps bot. The bot will communicate with ansible for the deployment, merging and shrinking tasks. The bot will also communicate with the AWS EC2 instance - infrastructure for fetching VM details. 

#### AWS EC2 - Infrastructure:
> We will use this instance to deploy the Virtual machines and configure them. In simple terms, all the nodes of the Ansible will be in this instance. This will be on private IP and access to this server(VM) is through our bot only. This server will help us in shrinking VMs by providing VM statistics.

#### Constraints: 
> * A user will not be able to execute all the Ansible commands through the Slack chat like ssh into one of the servers, adding users.
> * The bot will not suggest problems in commands explicitly.
> * The bot will not provide synchronization as multiple users might request for data and modifications at the same time. We will try to control it through the Singleton. But it won't guarantee synchronization.


### Additional Patterns
> We will be using a hybrid design pattern i.e. a mixture of Singleton Design pattern and Command Pattern.

#### Singleton Design Pattern: 
> We will be using Singleton Design pattern to make sure that at any time only one instance of the bot will be running.  If we do not implement this pattern then we might end up having multiple instances of the bot and this might result in the undesirable state. We would want to execute ansible commands in a synchronized manner.

#### Command Design Pattern: 
> The command pattern is a behavioral design pattern in which an object is used to encapsulate all information needed to perform an action or trigger an event. Four terms always associated with the command pattern are command, receiver, invoker, and client. Our bot will consist of all the 4 parts. Only, the commands will be received from the slack user. The bot will know when it is being addressed and will respond to it through the command.
