// Now, lets start by making it so that we can edit those values.

// Require Packages
const db = require('quick.db')

exports.run = (bot, message, args, func) => {

    // Return Statements
    if (!message.member.roles.find('name', 'bot-commander')) return func.embed(message.channel, '**Cette commande requière le role bot-commander**', ) // This returns if it CANT find the owner role on them. It then uses the function to send to message.channel, and deletes the message after 120000 milliseconds (2minutes)
    if (!message.mentions.channels.first() && args.join(" ").toUpperCase() !== 'NONE') return func.embed(message.channel, '**Veuillez mentionner un channel**\n > *!setChannel #channel*') // This returns if they don't message a channel, but we also want it to continue running if they want to disable the log

    // Fetch the new channel they mentioned
    let newChannel;
    if (args.join(" ").toUpperCase() === 'NONE') newChannel = ''; // If they wrote the word none, it sets newChannel as empty.
    else newChannel = message.mentions.channels.first().id; // If they actually mentioned a channel, it will set newChannel as that.

    // Update Channel
    db.updateText(`messageChannel_${message.guild.id}`, newChannel).then(i => {
        func.embed(message.channel, `**Loggin channel à été mis à jour avec succès en: ${message.mentions.channels.first()}**`) // Finally, send in chat that they updated the channel.
    })

} // Lets set the DM channel now, we can use this code we just wrote as a template.
