// Calling Packages
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const db = require('quick.db');

// We can call the file with all the functions here.
const func = require('./functions.js'); // If this returns an error for you (or you might be on ubuntu/linux), try '../functions.js'
// You can also change the name of func to something else like tools.
const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);
// We can call the JSON file here
//const commands = JSON.parse(fs.readFileSync('./commands.json', 'utf8'));
// We need to call the serverPrefixes JSON file
//const serverPrefixes = JSON.parse(fs.readFileSync('./serverPrefixes.json', 'utf8'))


// Global Settings
const prefix = '!'; // This is the prefix, you can change it to whatever you want.

// Listener Event: Runs whenever a message is received.
bot.on('message', message => {

    // Variables - Variables make it easy to call things, since it requires less typing.
    let msg = message.content.toUpperCase(); // This variable takes the message, and turns it all into uppercase so it isn't case sensitive.
    let sender = message.author; // This variable takes the message, and finds who the author is.
    let args = message.content.slice(prefix.length).trim().split(" "); // This variable slices off the prefix, then puts the rest in an array based off the spaces
    let cmd = args.shift().toLowerCase(); // This takes away the first object in the cont array, then puts it in this.

    //commands


    // We also need to make sure it doesn't respond to bots
    if (sender.bot && !msg === prefix + 'HOOK') return;
    if (!message.content.startsWith(prefix)) return; // We also want to make it so that if the message does not start with the prefix, return.

    // Command Handler - .trim() removes the blank spaces on both sides of the string
    try {
        let commandFile = require(`./commands/${cmd}.js`); // This will assign that filename to commandFile
        commandFile.run(bot, message, args, func); // This will add the functions, from the functions.js file into each commandFile.
    } catch(e) { // If an error occurs, this will run.
        console.log(e.message); // This logs the error message
    } finally { // This will run after the first two clear up
        console.log(`${message.author.username} ran the command: ${cmd}`);
    }

});

// Listener Event: Runs whenever the bot sends a ready event (when it first starts for example)
bot.on('ready', () => {

    // We can post into the console that the bot launched.
    console.log('Bot started.');


    bot.user.setGame('Visitez Misplay.fr !');


});
bot.on('guildMemberAdd', member => { // Make sure this is defined correctly.

    // Check if the guild has a custom auto-role
    db.fetchObject(`autoRole_${member.guild.id}`).then(i => {

        // Check if no role is given
        if (!i.text || i.text.toLowerCase() === 'none'); // We want to put this un our guildMemberAdd, but we want to delete the return statement and just replace it with ; so it can run the rest of the code
        else { // Run if a role is found...

            try { // Try to add role...
                member.addRole(member.guild.roles.find('name', i.text))
            } catch (e) { // If an error is found (the guild supplied an invalid role), run this...
                console.log("A guild tried to auto-role an invalid role to someone.") // You can commet this line out if you don't want this error message
            }

        }

        // The code will go here, inside the other fetchObject. If you don't have that fetchObject don't worry just put it in bot.on('guildMemberAdd').

        // Fetch the channel we should be posting in - FIRST, we need to require db in this app.js
        db.fetchObject(`messageChannel_${member.guild.id}`).then(i => {

            // Fetch Welcome Message (DMs)
            db.fetchObject(`joinMessageDM_${member.guild.id}`).then(o => {

                // DM User
                if (!o.text) console.log('Error: Join DM Message not set. Please set one using ~setdm <message>'); // This will log in console that a guild didn't set this up, you dont need to include the conosle.log
                else func.embed(member, o.text.replace('{user}', member).replace('{members}', member.guild.memberCount)) // This is where the embed function comes in, as well as replacing the variables we added earlier in chat.

                // Now, return if no message channel is defined
                if (!member.guild.channels.get(i.text)) return console.log('Error: Welcome/Leave channel not found. Please set one using ~setchannel #channel') // Again, this is optional. just the console.log not the if statement, we still want to return

                // Fetch the welcome message
                db.fetchObject(`joinMessage_${member.guild.id}`).then(p => {

                    // Check if they have a join message
                    if (!p.text) console.log('Error: User Join Message not found. Please set one using ~setwelcome <message>')
                    else func.embed(member.guild.channels.get(i.text), p.text.replace('{user}', member).replace('{members}', member.guild.memberCount)) // We actually want to send the message.

                })

            })

        })

    })

    // Now, since we're done with the welcome. lets do the leave
    bot.on('guildMemberRemove', member => {

        // Fetch Channel
        db.fetchObject(`messageChannel_${member.guild.id}`).then(i => {

            // If the channel is not found, return.
            if (!member.guild.channels.get(i.text)) return console.log('Error: Welcome/Leave channel not found. Please set one using ~setchannel #channel')

            // Fetch Leave Message
            db.fetchObject(`leaveMessage_${member.guild.id}`).then(o => {

                // Check if o.text is defined
                if (!o.text) console.log( 'Error: User leave message not found. Please set one using ~setleave <message>')
                else func.embed(member.guild.channels.get(i.text), o.text.replace('{user}', member).replace('{members}', member.guild.memberCount)) // Now, send the message.

            })

        })

    })

})


bot.login('TOKEN').catch(console.log);
