exports.run = (client, message, args) => {
  if(!args || args.size < 1) return message.reply("Donnez un nom de commande à reload.");
  // the path is relative to the *current folder*, so just ./filename.js
  delete require.cache[require.resolve(`./${args[0]}.js`)];
  message.reply(`La commande ${args[0]} à été rechargée.`);
};
