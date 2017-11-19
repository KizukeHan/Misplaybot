exports.run = (bot, message, args, func) => {
    let input = args[0];
    let role = message.guild.roles.find('name',input);
    let member = message.member;

    message.delete();
    if (args[0]==='pubg' || args[0]==='overwatch' || args[0]==='wwo'){
      member.removeRole(role).catch(console.error);
      return message.channel.send('Vous venez de perdre le role !');
    }

    else
    return message.channel.send('Vous ne pouvez pas sélectionner ce role!');

}
