
var Botkit = require('botkit');
var cmd = require('node-cmd');
var fs = require('fs');
var yaml = require('js-yaml');
var dict = require('./aws_instance_details.json');
var os = require('os');
var sleep = require('sleep');


// Function to get list of instances running on AWS server 
function getListOfInstances(callback){
    cmd.get("aws ec2 describe-instances --filters \"Name=instance-state-code,Values=16\" --query 'Reservations[*].Instances[*].[Tags[?Key==`Name`].Value]' --output text",
        function(err, data, stderr){
            if(data.length > 0){
                callback(data);
            }
            if(data.length === 0){
                callback("No instances are running");
            }
        }
    );
}


// Execute ansible commands on Ansible tower and process results
function ansiblecommand(rawtext, callback){

    var output = ['value','output'];
    output = checkinput(rawtext);
    if (output[0] == 'false'){
        callback(output[1]);
        return;
    }
    try {
        command = rawtext.slice(12);
        if(command == "ansible --list-hosts"){
            getListOfInstances(callback);
        }
        else{
            console.log(command)
            cmd.get(
                command,
                function(err, data, stderr){
                    console.log(data)
                    callback(data)
                }
            );
        } 
    } 
    catch (error) {
        console.log("Errors in executing ansible commands");
    }
}
exports.ansiblecommand = ansiblecommand;


// Function to get Merged Version of VMs
function merged_version(rawtext,callback){

    var output = ['value','output'];
    output = checkinput(rawtext);
    if (output[0] == 'false'){
        callback(output[1]);
        return;
    }

    // Check if correspondign VM playbook files exist, if not, handle errors.
    var vm1_file = "./AnsiblePlaybooks/"+rawtext.split(" ")[1]+".yaml";
    var vm2_file = "./AnsiblePlaybooks/"+rawtext.split(" ")[2]+".yaml";

    if(! fs.existsSync(vm1_file)){
        callback("The VM '"+rawtext.split(" ")[1]+"' does not exist");
        return;
    }

    if(! fs.existsSync(vm2_file)){
        callback("The VM '"+rawtext.split(" ")[2]+"' does not exist");
        return;
    }

    var vm1_packages = get_tasks(rawtext.split(" ")[1]);
    var vm2_packages = get_tasks(rawtext.split(" ")[2]);
    
    var mergedArray = vm1_packages.concat(vm2_packages);
    var outputStr = "The list of packages to be installed in merged vm: \n\t";
    for (var i = 0; i < mergedArray.length; i++) {
        if("apt" in mergedArray[i]){
            outputStr += mergedArray[i]['apt'].split(" ")[0].split("=")[1] + " \n\t";
        }
        if("pip" in mergedArray[i]){
            outputStr += mergedArray[i]['pip'].split(" ")[0].split("=")[1] + " \n\t";
        }
    }
    callback(outputStr);
}
module.exports.merged_version = merged_version;


// Function to Merge two VMs
function merge(rawtext,callback){

    var output = ['value','output'];
    output = checkinput(rawtext);
    if (output[0] == 'false'){
        
        callback(output[1]);
        return;
    }

    try {
        // Check if correspondign VM playbook files exist, if not, handle errors.
        var new_VM_name = rawtext.split(" ")[3];
        var vm1_file = "./AnsiblePlaybooks/"+rawtext.split(" ")[1]+".yaml";
        var vm2_file = "./AnsiblePlaybooks/"+rawtext.split(" ")[2]+".yaml";
        
        if(! fs.existsSync(vm1_file)){
            callback("The VM '"+rawtext.split(" ")[1]+"' does not exist");
            return;
        }
    
        if(! fs.existsSync(vm2_file)){
            callback("The VM '"+rawtext.split(" ")[2]+"' does not exist");
            return;
        }
        
        // Get list of packages installed in each VMs from Ansible Playbooks
        var vm1_packages = get_tasks(rawtext.split(" ")[1]);
        var vm2_packages = get_tasks(rawtext.split(" ")[2]);
        var packageList_vm1 = []
        
        for (var i = 0; i < vm1_packages.length; i++) {
            if("apt" in vm1_packages[i]){
                packageList_vm1.push(vm1_packages[i]['apt'].split(" ")[0].split("=")[1]);
            }
            else if("pip" in vm1_packages[i]){
                packageList_vm1.push(vm1_packages[i]['pip'].split(" ")[0].split("=")[1]);
            }
        }
    
        var yamlData = yaml.safeLoad(fs.readFileSync(vm1_file, 'utf8'));
    
        for (var i = 0; i < vm2_packages.length; i++) {
            
            if("apt" in vm2_packages[i]){
                var curr_package = vm2_packages[i]['apt'].split(" ")[0].split("=")[1];
            }
            else if("pip" in vm2_packages[i]){
                var curr_package = vm2_packages[i]['pip'].split(" ")[0].split("=")[1];
            }
            else{
                continue;
            }

            if(packageList_vm1.indexOf(curr_package) <= -1){
                yamlData[1]['tasks'].push(vm2_packages[i]);
            }
        }
    
        // Update EC2 host names in the yaml file
        try{
            yamlData[0]['tasks'][0]['ec2']['instance_tags']['Name'] = new_VM_name;
            yamlData[0]['tasks'][0]['ec2']['count_tag']['Name'] = new_VM_name;
            yamlData[0]['tasks'][2]['add_host']['groups'] = new_VM_name;
            yamlData[1]['hosts'] = new_VM_name;
        }
        catch(error){
            console.log(error);
            callback("Error in setting new VM name in playbook.");
            return;
        }
    
        // Create new Playbook file for merged VM
        var stream = fs.createWriteStream("./AnsiblePlaybooks/"+ new_VM_name +".yaml");
        stream.once('open', function(fd) {
          stream.write(yaml.dump(yamlData));
          stream.end();
        });
        
        cmd.get(
            "ansible-playbook AnsiblePlaybooks/"+new_VM_name+".yaml",
            function(err, data, stderr){
                console.log(data.tail)
                callback(data)
            }
        );    
    } catch (error) {
        console.log(error);
    }
}
module.exports.merge = merge;


// Function to List all EC2 hosts which are shrinkable
function list_shrinkable(rawtext,callback){
    
    var output = ['value','output'];
    output = checkinput(rawtext);
    if (output[0] == 'false'){
        callback(output[1]);
        return;
    }
    
    cmd.get(
        "ansible-playbook ./AnsiblePlaybooks/ansimoni.yaml",
        function(err, data, stderr){
            outputjson = JSON.parse("{"+data.substring(data.indexOf("dict(intance_out.items()+ec2.items())")-1 , data.indexOf("PLAY RECAP")));
            console.log(outputjson['dict(intance_out.items()+ec2.items())']['results']);

            var instance_shrincable = [];
            var cnt = outputjson['dict(intance_out.items()+ec2.items())']['instances'].length;

            // Check resource consumption of VMs
            for(var i=0; i< cnt; i++){
                abg_consumption = JSON.parse(outputjson['dict(intance_out.items()+ec2.items())']['results'][i]['stdout']);
                var avrg = 0;
                for(var j=0; j<abg_consumption['Datapoints'].length; j++){
                    avrg += abg_consumption['Datapoints'][j]["Average"];
                }
                if(abg_consumption['Datapoints'].length > 0){
                    avrg = avrg/abg_consumption['Datapoints'].length;
                }
                if(avrg > 0 && avrg < 10){
                    if(outputjson['dict(intance_out.items()+ec2.items())']['instances'][i]['state']['name'] == "running"){
                        instance_shrincable.push(outputjson['dict(intance_out.items()+ec2.items())']['instances'][i]['tags']['Name']);
                    }
                }
            }
            
            // Get list of shrinkable VMs
            var outputStr = "The list of shrinkable VMs: \n\t";
            var fileStr = "";
            for(var j = 0; j<instance_shrincable.length;j++){
                outputStr += instance_shrincable[j] + " \n\t";
                fileStr += instance_shrincable[j] + " \n";
            }

            // Create file containing EC2 istances that can be shrinked
            fs.writeFileSync('./AnsiblePlaybooks/shrinkable_vm_list.txt',fileStr);
            if(instance_shrincable.length === 0){
                callback("There are no shrinkable VMs.");
            }
            if(instance_shrincable.length > 0) {
                callback(outputStr);
            }
        }
    );
    
}
module.exports.list_shrinkable = list_shrinkable;


// Function to get Shrinked Version of VMs
function shrinked_version(rawtext,callback){

    var output = ['value','output'];
    output = checkinput(rawtext);
    if (output[0] == 'false'){
        
        callback(output[1]);
        return;
    }
    
    var vm = rawtext.split(" ")[1];
    var vm_file = "./AnsiblePlaybooks/"+vm+".yaml";
    
    // Validate EC2 host name on AWS server
    if(! fs.existsSync(vm_file)){
        callback("The VM '"+vm+"' does not exist");
        return;
    }

    // Get list of shrinkable VMs from text file
    try {  
        var data = fs.readFileSync('./AnsiblePlaybooks/shrinkable_vm_list.txt', 'utf8');
        if (data.indexOf(vm)== -1){
            callback("Given VM is not available in shrinkable list.");
            return;
        } 
    } 
    catch(e) {
        console.log('Error:', e.stack);
    }

    // Get VM details before shrink
    var old_instance_type = get_instance_type(vm); 
    var old_output = 'Previous config: \n';
    var output = dict[old_instance_type];
    for (var key in output){
        old_output+='\t' + key + ':\t' + output[key] + '\n';
    }

    // Get VM details after shrink
    var new_instance_type = 't2.micro'; 
    var output = dict[new_instance_type];
    var new_output = 'New config: \n';
    for (var key in output){
        new_output+='\t' + key + ':\t' + output[key] + '\n';
        }
    callback(old_output +'\n' + new_output);
    
}
exports.shrinked_version = shrinked_version;


// Function to get the type of EC2 instance
function get_instance_type(filename){
    // Read instance type from Playbook file
    try {
        var yamlData = yaml.safeLoad(fs.readFileSync('./AnsiblePlaybooks/'+filename+'.yaml', 'utf8'));
        var jsonString = JSON.stringify(yamlData, null, 4);
        var jsonData = JSON.parse(jsonString);
    }
    catch (e) {
        console.log(e);
    }
    var instance_type = jsonData[0].vars['instance_type'];
    return instance_type;
}
exports.get_instance_type = get_instance_type;

