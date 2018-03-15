
var Botkit = require('botkit');
var vmops = require('./vmops.js');

var controller = Botkit.slackbot({
  debug: false
  // Note:
  // 1. include "log: true" to enable logging in order to troubleshoot problems
  // 2. include "logLevel: 0-7" to adjust logging verbosity
});

// Connect Bot to user stream of messages
controller.spawn({
  retry: true,
  token: process.env.SLACKTOKEN,
}).startRTM()

//**************************************************************************
// Process user commands and respond

// user command for ansible services 
controller.hears('firecommand',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
  //console.log(message)
  vmops.ansiblecommand( message.text, function(w){
    bot.reply(message,w)
  })
});

// user command for getting merged version of VMs
controller.hears('merged_version',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
  //console.log(message)
  vmops.merged_version(message.text, function(w){
    bot.reply(message,w)
  })
});

// user command for merging VMs
controller.hears('merge',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
  //console.log(message)
  vmops.merge(message.text,function(w){
    bot.reply(message,w)
  })
});

// user command listing shrinkable VMs
controller.hears('list_shrinkable',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
  //console.log(message)
  vmops.list_shrinkable(message.text,function(w){
    bot.reply(message,w)
  })
});

// user command for gettign shrinked version of VMs
controller.hears('shrinked_version',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
  //console.log(message)
  vmops.shrinked_version(message.text, function(w){
    bot.reply(message,w)
  })
});

// user command for shrinking VMs
controller.hears('shrink',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
  //console.log(message)
  vmops.shrink(message.text,function(w){
    bot.reply(message,w)
  })
});

// default user command handling
controller.hears('.*',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
  //console.log(message)
  vmops.default_msg(message.text,function(w){
  bot.reply(message,w)
})
});
