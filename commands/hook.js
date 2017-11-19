exports.run = (bot, message, args, func) => {
  let msg = message.content.toUpperCase();
  const prefix = '!';
  // Delete the message that the user sends
  message.delete();

  if (msg === prefix + 'HOOK') { // This checks if the only thing they sent was 'Hook'
      return func.hook(message.channel, 'Hook Usage', `${prefix}hook <title>, <message>, [HEXcolor], [avatarURL]\n\n**<> is required\n[] is optional**`,'FC8469','https://cdn4.iconfinder.com/data/icons/global-logistics-3/512/129-512.png') // Remeber that \n means new line. This is also using a custom HEX id, and an image.
  }

  let hookArgs = message.content.slice(prefix.length + 4).split(","); // This slices the first 6 letters (prefix & the word hook) then splits them by 'commas'

  func.hook(message.channel, hookArgs[0], hookArgs[1], hookArgs[2], hookArgs[3]); // This is where it actually calls the hook.


}
