const userSchema = require('../configs/database/schemas/userSchema')
const bcrypt = require("bcryptjs")
const { MessageEmbed } = require('discord.js')
module.exports = {
    aliases: [], description: "",
    run: async(client, messageCreate, args) => {

        const message = messageCreate

        const userConfig = await userSchema.findOne({userID: message.author.id})
        if(!userConfig) {
            await userSchema.findOneAndUpdate({userID: message.author.id}, {userID: message.author.id, language: "english", prefix: process.env.PREFIX}, {upsert: true})
            return message.reply("Please, redo the command, you were not registered in our DB, now you are.")
        } else {
            if(!args[0] || !args[1] || !args[2]) {
                return message.reply("Missing args.")
            } else {
                const passwordToAcessDB = args[0]
                const accountName = args[1]
                const password = args[2]
                bcrypt.genSalt(10, async(err, salt) => {
                    bcrypt.hash(password, salt, async(err, hash) => {
                        if(err) {
                            console.log(err)
                            return message.reply(`Something went wrong while encrypting your password:\n\`\`\`${err}\`\`\``)
                        } else {
                            const dataToInsert = [{"account" : accountName, "passwordCrypt" : hash}]
                            if(userConfig.data){
                                const accObj = userConfig.data.toObject()
                                if(accObj.length === 0) {
                                    await userSchema.findOneAndUpdate({userID: message.author.id}, {data: dataToInsert}, {upsert: true})
                                    const Hashed = new MessageEmbed()
                                        .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
                                        .setDescription(`✅ - Hashed\n\`\`\`Account Name: ${accountName}\nHashed Password: ${hash}\`\`\``)
                                        .setFooter("**DO NOT** share with anyone your Hashed password!")
                                    return message.reply({ embeds: [Hashed] })
                                } else {
                                    accObj.filter(async(item) => {
                                        if(accountName.includes(item.account)) {
                                            return message.reply("Duplicated entry, you already have an account with that name!")
                                        } else {
                                            await userSchema.findOneAndUpdate({userID: message.author.id}, {$addToSet: {data: dataToInsert}}, {upsert: true})
                                            const Hashed = new MessageEmbed()
                                                .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
                                                .setDescription(`✅ - Hashed\n\`\`\`Account Name: ${accountName}\nHashed Password: ${hash}\`\`\``)
                                                .setFooter("**DO NOT** share with anyone your Hashed password!")
                                            return message.reply({ embeds: [Hashed] })
                                        }
                                    })
                                }
                            } else if(!userConfig.data){
                                await userSchema.findOneAndUpdate({userID: message.author.id}, {data: {account: accountName, password: hash}}, {upsert: true})
                                const Hashed = new MessageEmbed()
                                    .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
                                    .setDescription(`✅ - Hashed\n\`\`\`Account Name: ${accountName}\nHashed Password: ${hash}\`\`\``)
                                    .setFooter("**DO NOT** share with anyone your Hashed password!")
                                return message.reply({ embeds: [Hashed] })
                            }
                        }
                    })
                })
                
            }
        }

    }
}