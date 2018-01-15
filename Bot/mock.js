var Botkit = require('botkit');
var sinon = require('sinon');
var vmops = require('./vmops.js');

//===============> Sinion starting




fs = require('fs');
//var mockup_data = null;
fs.readFile('./../Mockups/mockup.json','utf8',function(err,data){
    if (err){
        console.log(err);
    }
    var mockup_data = data;
    mockup_json = JSON.parse(mockup_data);
});


var mock = require('mock-require');
 
mock('firecommand_uptime', { request: function(callback) {
  callback(mockup_json.usecase[0].result.output);
  

}});

mock('list_hosts', { request: function(callback) {
  callback(mockup_json.usecase[1].result.output);
  

}});


mock('merged_version_call', { request: function(callback) {

  var cumulative = mockup_json.usecase[2].result.output;
  var vm1=mockup_json.usecase[2].internalCommands[0].result.output;
  var vm2=mockup_json.usecase[2].internalCommands[1].result.output;
  callback(cumulative+vm1+vm2);
  

}});

mock('merge_call', { request: function(callback) {
  callback(mockup_json.usecase[3].result.output);
  
}});

mock('shrinkable_call', { request: function(callback) {
  callback(mockup_json.usecase[4].result.output);
  
}});


mock('shrinked_version', { request: function(callback) {
  callback(mockup_json.usecase[5].result.output);
  
}});

mock('shrink', { request: function(callback) {
  callback(mockup_json.usecase[6].result.output);
  
}});



function uptime(callback){
	var function_call = require("firecommand_uptime");
	function_call.request(callback)
}
module.exports.uptime = uptime;

function list_hosts(callback){
	var function_call = require("list_hosts");
	function_call.request(callback)
}
module.exports.list_hosts = list_hosts;

function merged_version_call(callback){
	var function_call = require("merged_version_call");
	function_call.request(callback)
}
module.exports.merged_version_call = merged_version_call;

function merge_call(callback){
	var function_call = require("merge_call");
	function_call.request(callback)
}
module.exports.merge_call = merge_call;


function shrinkable_call(callback){
	var function_call = require("shrinkable_call");
	function_call.request(callback)
}
module.exports.shrinkable_call = shrinkable_call;

function shrinked_version(callback){
	var function_call = require("shrinked_version");
	function_call.request(callback)
}
module.exports.shrinked_version = shrinked_version;

function shrink(callback){
	var function_call = require("shrink");
	function_call.request(callback)
}
module.exports.shrink = shrink;





