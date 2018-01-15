
var Botkit = require('botkit');

//var childProcess = require("child_process");


var vmops = require('./vmops.js');

var controller = Botkit.slackbot({
  debug: false
  //include "log: false" to disable logging
  //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

// connect the bot to a stream of messages
controller.spawn({
  retry: true,
  token: process.env.SLACKTOKEN,
}).startRTM()

// give the bot something to listen for.
//controller.hears('string or regex',['direct_message','direct_mention','mention'],function(bot,message) {

controller.hears('firecommand',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
  //console.log(message)
  vmops.ansiblecommand( message.text, function(w){
    bot.reply(message,w)
  })
  
});

controller.hears('merged_version',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
  //console.log(message)
  vmops.merged_version(message.text, function(w){
    bot.reply(message,w)
  })
});


controller.hears('merge',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
  //console.log(message)
  vmops.merge(message.text,function(w){
    bot.reply(message,w)
  })
});


controller.hears('list_shrinkable',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
  //console.log(message)
  vmops.list_shrinkable(message.text,function(w){
    bot.reply(message,w)
  })
});


controller.hears('shrinked_version',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
  //console.log(message)
  vmops.shrinked_version(message.text, function(w){
    bot.reply(message,w)
  })
});


controller.hears('shrink',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
  //console.log(message)
  vmops.shrink(message.text,function(w){
    bot.reply(message,w)
  })
});

controller.hears('.*',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
  //console.log(message)
  vmops.default_msg(message.text,function(w){
  bot.reply(message,w)
})
});
