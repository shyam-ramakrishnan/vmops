# BOT.md
Following is the summary of the BOT MILESTONE 

### USE-CASES

After review of Use Cases with the Professor, we have updated the required modifications in our Design Document. The refined use cases are as follows:

#### 	Use Case 1: Execute shell commands in the VM through the bot. 
##### 1. Preconditions : 
> Ansible is running in a VM and the bot has remote access to the ansible VM. The infrastructure VMs have unique hostnames. 
##### 2. Main Flow:
> User will request for an Ansible command to be executed on the ansible controlled machine [S1]. The bot will return the output of the shell command[S2].
##### 3. Subflows:  
> **S1**: User sends an Ansible command to be executed on Ansible control machine to be queried on the Virtual Machine.     
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

### MOCKING

> Our bot primarily relies on Ansible's service to query remote virtual machines and fetch responses. Since we have not yet implemented the Ansible service middleware for the current milestone, we have queries and corresponding responses compiled in a mock JSON file that we interface with for the bot's operation.  

> The repo consists of the following JSON file which contains bot query and reponse tokens for the sake of mocking:
> Refer [here](https://github.ncsu.edu/sjain11/VMOps/tree/master/Mockups)  

> We need to use npm install to install 2 required modules for mocking viz. 'npm install sinon' and 'npm install mock-require'.  

### BOT-IMPLEMENTATION

#### Bot Platform
> The basic interaction of the bot with the user is implemented. We have a fully operational bot within our Slack platform. The bot can respond to the basic commands. The ansible service and the AWS deployment will be completed in the next milestone. 

#### Bot integration
> The bot can communicate with the user through Slack. The user can pass any valid shell command to the bot and the bot responds with the appropriate reply. The bot is also able to handle the alternative flows wherein the shell command is not valid. Similarly for use case 2 and 3, the bot gets the VMs which are shrinkable/mergeable.  

For bot implementation, please refer [here](https://github.ncsu.edu/sjain11/VMOps/tree/master/Bot)  

### SELENIUM-TESTING
> We have used the framework given by Dr. Parnin to implement the selenium testing.
Selenium is an automated testing framework for web applications. We have written test cases to check the integration of our bot with the Slack workspace and check the functioning of all the use cases. Selenium automates the execution of these test cases and provides the result of the complete test suite.  
The file for selenium testing can be found [here](https://github.ncsu.edu/sjain11/VMOps/blob/master/Selenium_testing/src/test/java/selenium/tests/BotTesting.java).  


### TASK-TRACKING

We did this Milestone spanning 2 weeks. A detailed Worksheet has been created capturing our deadlines and tasks over the 2 weeks.  

The Worksheet can be found [here](https://github.ncsu.edu/sjain11/VMOps/blob/master/Worksheet.md)  
The associated Trello card which we have used for Tracking is found [here](https://trello.com/b/V4XDE5s5)

### SCREENCAST

Screencast can be found [here](https://youtu.be/JNuTxaZls_E)  


The design document can be found [here](https://github.ncsu.edu/sjain11/VMOps/blob/master/DESIGN.md)
