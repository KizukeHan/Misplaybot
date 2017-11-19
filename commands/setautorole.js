const db = require('quick.db')

exports.run = (bot, message, args, func) => {

    if (!message.member.hasPermission('bot-commander')) return message.channel.send('Cette commande requière le role bot-commander`') // Tell them that they dont have the proper perms
    if (!args.join(" ")) return message.channel.send('Please enter arguments. `setAutoRole <roleName>`') // Tell them if they didn't supply arguments

    db.updateText(`autoRole_${message.guild.id}`, args.join(" ").trim()).then(i => { // .trim() removes the whitespaces on both ends of the string.

        message.channel.send('auto-role changé avec succès en: `' + i.text + '`'); // This tells them what they just set the autorole to.

    })

}
