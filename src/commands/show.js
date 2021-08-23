const { MessageEmbed } = require('discord.js')
const userSchema = require('../configs/database/schemas/userSchema')
module.exports = {
    aliases:[], description: "",
    run:async(client,messageCreate,args) => {
        //Just testing
        const message = messageCreate
        const userConfig = await userSchema.findOne({userID: messageCreate.author.id})
        const accObj = userConfig.data.toObject()
        const accL = accObj.length
        let text
        for(let i = 0; i < accL; i++) {
            text += "\n" + accObj[i].account
        }
        message.reply(text.replace("undefined\n", ""))
        

    }
}