const userSchema = require("../../../configs/database/schemas/userSchema")
module.exports = async(client, message) => {
    
    let PREFIX;
    const userConfig = await userSchema.findOne({userID: message.author.id})


    if(message.channel.type === "DM" && !message.author.bot) {
        if(!userConfig) {
            PREFIX = process.env.PREFIX
            return await userSchema.findOneAndUpdate({userID: message.author.id}, {userID: message.author.id, language: "english", prefix: process.env.PREFIX}, {upsert: true})
        } else {
            PREFIX = userConfig.prefix
        }
        const [cmdName, ...cmdArgs] = message.content
            .slice(PREFIX.length)
            .trim()
            .split(/\s+/);
        if(client.commands.get(cmdName)) {client.commands.get(cmdName)(client, message, cmdArgs)}
        else return message.reply("Coudn't find this command, maybe retry?") 
    }

}