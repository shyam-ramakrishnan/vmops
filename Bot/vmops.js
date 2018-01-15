var Botkit = require('botkit');
//var sinon = require('sinon');
var cmd = require('node-cmd');
var fs = require('fs');
var yaml = require('js-yaml');
var dict = require('./aws_instance_details.json');
var os = require('os');
var sleep = require('sleep');

// This is the dictonary to shrink a EC2 instance from one type to another type.
var version_shrink = {
    "t2.2xlarge" : "t2.xlarge",
    "t2.xlarge" : "t2.large",
    "t2.large" : "t2.medium",
    "t2.medium" : "t2.small",
    "t2.small" : "t2.micro",
    "t2.micro" : "t2.nano",
    "m4.16xlarge" : "m4.10xlarge",
    "m4.10xlarge" : "m4.4xlarge",
    "m4.4xlarge" : "m4.2xlarge",
    "m4.2xlarge" : "m4.xlarge",
    "m4.xlarge" : "m4.large",
    "m4.large" : "t2.medium",
    "c4.8xlarge" : "c4.4xlarge",
    "c4.4xlarge" : "c4.2xlarge",
    "c4.2xlarge" : "c4.xlarge",
    "c4.xlarge" : "c4.large",
    "c4.large" : "t2.small",
    "g3.16xlarge" : "g3.8xlarge",
    "g3.8xlarge" : "g3.4xlarge",
    "g3.4xlarge" : "c4.2xlarge",

    "m1.xlarge" : "m1.large",
    "m1.large" : "m1.medium",
    "m1.medium" : "m1.small",
    "c1.xlarge" : "c1.medium",
    "c5.18xlarge" : "c5.9xlarge",
    "c5.9xlarge" : "c5.4xlarge",
    "c5.4xlarge" : "c5.2xlarge",
    "c5.2xlarge" : "c5.xlarge",
    "c5.xlarge" : "c5.large",
};

// This is the function to get the list of instances running on the deploy infrastructure. 
function getListOfInstances(callback){
    cmd.get(
        //"python /etc/ansible/ec2.py --refresh",
  "aws ec2 describe-instances --filters \"Name=instance-state-code,Values=16\" --query 'Reservations[*].Instances[*].[Tags[?Key==`Name`].Value]' --output text",
        function(err, data, stderr){
           // var dt = JSON.parse(data);
            /*
            for(var i = 0; i<data["ec2"].length ; i++){
                console.log(data["ec2"][i])
            }
            */ 
            if(data.length > 0){
            callback(data);
    }
      if(data.length === 0){
      callback("No instances are running");
    }
           // if("ec2" in dt){
           //     console.log(dt.ec2);
           //     callback("The list of currently running instances is :\n\t"+dt.ec2.join(", \n\t"));
           // }
           // else{
           //     callback("No instances are running!!");
           // }
        }
    );
}

//console.log("starrting");
//getListOfInstances(function(st){console.log(st);});

function checkinput(rawtext){
    var input_command = rawtext.split(" ")
    if (input_command[0] == "firecommand" ){
         //This is for first use case
         if (input_command[1] === 'ansible' || input_command[1] === 'ansible-playbook'){
            return ['true'];
         }
         else if (input_command[1] == 'uptime'){
            return ['true'];
             }
         else{
             return ['false','Please try the command: firecommand uptime or firecommand ansible --list-hosts'];
         }
    }     
  else if (input_command[0] == 'merged_version'){
        // This is the input for 2nd use case
        if (input_command.length == 3){
            return ['true','None'];
        }
        else{
            //("Please try the command merged_version vm1 vm2")
            return ['false','Please try the command: merged_version vm1 vm2'];
        }
    }
        
    else if (input_command[0] == 'merge'){
        if (input_command.length == 4){
            return ['true','None'];
        }
        else{
            //("Please try the command merge vm1 vm2 vm3")
            return ['false','Please try the command: merge vm1 vm2 vm3'] ;
        }
    }
    else if (input_command[0] == 'list_shrinkable'){
        return ['true','none'];
    }

    else if(input_command[0] == 'shrinked_version'){
        if (input_command.length == 2){
            return ['true','None'];
        }
        else{
            return ['false','Please try the command: shrinked_version vm1'] ;
        }
    }
    else if (input_command[0] == 'shrink'){
        if (input_command.length == 2){
            return ['true','None'];
        }
        else{
            return ['false','Please try the command: shrink vm1'] ;
        }
    }
    else{
        return ["false","I'm still learning please try other commands: firecommand uptime or firecommand ansible --list-hosts "];
    }

}
exports.checkinput = checkinput;


function ansiblecommand(rawtext, callback){
    // program logic to execute ansible command and return the output in user understandable form.
    //get data from mockup file and send it over to callback.
    //Check the input first.
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
        
    } catch (error) {
        console.log("Errors in executing ansible commands");
    }
}
exports.ansiblecommand = ansiblecommand;


function merged_version(rawtext,callback){
    /*
    check if vm named files are present. If not handle error.
    read from both the files and merge two arrays.
    Return output as a proper string to UI.
    */
    
    //rawtext = "merged_version vm1 vm2"
    //Check the input first.
    var output = ['value','output'];
    output = checkinput(rawtext);
    if (output[0] == 'false'){
        callback(output[1]);
        return;
    }

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

function merge(rawtext,callback){
    /*
    check if vm named files are present. If not handle error.
    read from both the files and merge two tasks arrays.
    create new vm file with input file name.
    play this playbook.
    */
    
    //rawtext = "merged_version vm1 vm2 vm3"
    //Check the input first.
    var output = ['value','output'];
    output = checkinput(rawtext);
    if (output[0] == 'false'){
        
        callback(output[1]);
        return;
    }

    try {
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
    
        //Updating the host names in the file.
        try{
            yamlData[0]['tasks'][0]['ec2']['instance_tags']['Name'] = new_VM_name;
            yamlData[0]['tasks'][0]['ec2']['count_tag']['Name'] = new_VM_name;
            yamlData[0]['tasks'][2]['add_host']['groups'] = new_VM_name;
            yamlData[1]['hosts'] = new_VM_name;
        }
        catch(error){
            console.log(error);
            callback("Issue in setting new vm name in yaml file.");
            return;
        }
    
    
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

function list_shrinkable(rawtext,callback){
    //Check the input first.
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
                    //check if the file 
                    //console.log(avrg);
                    //console.log(j);
                    //console.log(outputjson['dict(intance_out.items()+ec2.items())']['instances'][i]['tags']['Name']);
                    if(outputjson['dict(intance_out.items()+ec2.items())']['instances'][i]['state']['name'] == "running"){
      instance_shrincable.push(outputjson['dict(intance_out.items()+ec2.items())']['instances'][i]['tags']['Name']);

      }
                }

            }
            console.log("================>\n");            
            console.log(instance_shrincable);
            var outputStr = "The list of Shrnkiable VMs: \n\t";
            var fileStr = "";
            for(var j = 0; j<instance_shrincable.length;j++){
                outputStr += instance_shrincable[j] + " \n\t";
                fileStr += instance_shrincable[j] + " \n";
            }
    fs.writeFileSync('./AnsiblePlaybooks/shrinkable_vm_list.txt',fileStr);
            //write to a file 
      if(instance_shrincable.length === 0){
          callback("There are no shrinkable VMs");
      }
            if(instance_shrincable.length > 0) {
      callback(outputStr);
    }
        }
    );
    
}
module.exports.list_shrinkable = list_shrinkable;

function shrinked_version(rawtext,callback){
    //Check the input first.
    var output = ['value','output'];
    output = checkinput(rawtext);
    if (output[0] == 'false'){
        
        callback(output[1]);
        return;
    }
    
    var vm = rawtext.split(" ")[1];
    var vm_file = "./AnsiblePlaybooks/"+vm+".yaml";
    
    //Check if the vm exists
    if(! fs.existsSync(vm_file)){
        callback("The VM '"+vm+"' does not exist");
        return;
    }

    //Check if the vm exists in the list of shrinkable vm's
    // require("fs").readFile("./AnsiblePlaybooks/shrinkable_vm_list.txt", function(err, cont) {
    //     if (err)
    //         throw err;
    //     console.log("String"+(cont.indexOf(rawtext.split(" ")[1])>-1 ? " " : " not ")+"found");
    // });

    try {  
        var data = fs.readFileSync('./AnsiblePlaybooks/shrinkable_vm_list.txt', 'utf8');
        if (data.indexOf(vm)== -1){
            callback("The given vm is not there is the shrinkable list");
            return;
        } 
        
    } catch(e) {
        console.log('Error:', e.stack);
    }

    var old_instance_type = get_instance_type(vm); // get_instance_facts(virtual_machine)
    var old_output = 'Previous config: \n';
    var output = dict[old_instance_type];
    for (var key in output){
        old_output+='\t' + key + ':\t' + output[key] + '\n';
    }

    var new_instance_type = 't2.micro'; // get_instance_facts(virtual_machine)
    var output = dict[new_instance_type];
    var new_output = 'New config: \n';
    for (var key in output){
        new_output+='\t' + key + ':\t' + output[key] + '\n';
        }
    callback(old_output +'\n' + new_output);
    
}
exports.shrinked_version = shrinked_version;

function shrink(rawtext,callback){
    
        var name_to_id = {}
        var vm_name = rawtext.slice(7)
    
        var vm_file = "./AnsiblePlaybooks/"+vm_name+".yaml";
        
        //Check if the vm exists
        if(! fs.existsSync(vm_file)){
            if(!vm_name){
                callback("Please provide VM name after shrink command!");
            }
            else{
                callback("The VM '"+vm_name+"' does not exist");
            }
            return;
        }
    
        try {  
            var data = fs.readFileSync('./AnsiblePlaybooks/shrinkable_vm_list.txt', 'utf8');
            if (data.indexOf(vm_name)== -1){
                callback("The given vm is not there is the shrinkable list");
                return;
            } 
            
        } catch(e) {
            console.log('Error:', e.stack);
        }
    
    
        var vm_id = ""
        var vm_type = ""
        command = "aws ec2 describe-instances --query 'Reservations[*].Instances[*].[InstanceId,InstanceType,Tags[?Key==`Name`].Value]' --output text",
        console.log(command)
        cmd.get(
            command,
            function(err, data, stderr){
                console.log(data)
                var list1 = data.split(/\t|\n/)
                console.log(list1)
                for (var i = 0; i < list1.length; i++ )
                {
                    if (list1[i] === vm_name){
                        vm_id = list1[i-2]
                        vm_type = list1[i-1]
                    }
                }
                console.log(vm_id)
                sleep.sleep(7)
                command = "aws ec2 stop-instances --instance-id " + vm_id,
                console.log(command)
                cmd.get(
                    command,
                    function(err, data, stderr){
                        console.log(data)
                        sleep.sleep(60)
                        
                        //command1 = "aws ec2 modify-instance-attribute --instance-id i-0e58cfd588d333730 --instance-type \"{\"Value\":\"t2.micro\"}\"",
                        command1 = "aws ec2 modify-instance-attribute --instance-id " + vm_id + " --instance-type \"{\\\"Value\\\":\\\""+version_shrink[vm_type]+"\\\"}\"",
                        console.log(command1)
                        cmd.get(
                            command1,
                            function(err, data, stderr){
                                console.log(data)
                                sleep.sleep(10)
                                command2 = "aws ec2 start-instances --instance-id " + vm_id + " --output text",
                                console.log(command2)
                                cmd.get(
                                    command2,
                                    function(err, data, stderr){
                                        console.log(data)
                                        sleep.sleep(15)
                                        callback(data)     
                                    }
                                );                             
                            }
                        );                     
                    }
                );
            }
        ); 
    }
    exports.shrink = shrink;

function getExactCount(filename){
    try {
        var yamlData = yaml.safeLoad(fs.readFileSync('AnsiblePlaybooks/'+filename+'.yaml', 'utf8'));
        var jsonString = JSON.stringify(yamlData, null, 4);
        var jsonData = JSON.parse(jsonString);
        //console.log(jsonData);
    }
    catch (e) {
        console.log(e);
    }
    var exact_count = jsonData[0].tasks[0].ec2.exact_count;
    return exact_count;
}
exports.getExactCount = getExactCount;

function default_msg(rawtext,callback){
    callback("Command not supported in VMOps!!\nPlease use one from below: \n1. 'firecommand' \n2. 'merged_version' \n3. 'merge' \n4. 'list_shrinkable' \n5. 'shrinked_version' \n6. 'shrink'\n");
}
exports.default_msg = default_msg;



function get_instance_type(filename){
    try {
        var yamlData = yaml.safeLoad(fs.readFileSync('./AnsiblePlaybooks/'+filename+'.yaml', 'utf8'));
        var jsonString = JSON.stringify(yamlData, null, 4);
        var jsonData = JSON.parse(jsonString);
        //console.log(jsonData);
    }
    catch (e) {
        console.log(e);
    }
    var instance_type = jsonData[0].vars['instance_type'];
    return instance_type;
}
exports.get_instance_type = get_instance_type;




function get_tasks(filename){
    var tasks_list = [];
    try {
        var yamlData = yaml.safeLoad(fs.readFileSync('./AnsiblePlaybooks/'+filename+'.yaml', 'utf8'));
        var jsonString = JSON.stringify(yamlData, null, 4);
        var jsonData = JSON.parse(jsonString);
        tasks_list = jsonData[1]['tasks'];
    }
    catch (e) {
        console.log(e);
    }
    return tasks_list;
}
exports.get_tasks = get_tasks;

/* var output_D = get_tasks('vm2');
console.log(output_D); */
