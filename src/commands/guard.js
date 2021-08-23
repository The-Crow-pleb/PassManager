const userSchema = require('../configs/database/schemas/userSchema')
const { MessageEmbed } = require('discord.js')
const {randomBytes, createCipheriv} = require("node:crypto")
module.exports = {
    aliases: [], description: "",
    run: async(client, messageCreate, args) => {

        const message = messageCreate; let rps;

        const userConfig = await userSchema.findOne({userID: message.author.id})
        if(!userConfig) {
            await userSchema.findOneAndUpdate({userID: message.author.id}, {userID: message.author.id, language: "english", prefix: process.env.PREFIX, premium: false}, {upsert: true})
            return message.reply("Please, redo the command, you were not registered in our DB, now you are.")
        } else {
            if(!args[0] || !args[1] || !args[2]) {
                return message.reply("Missing args.")
            } else {
                //Three essentials for security reasons:
                const passwordToAcessDB = args[0]; const accountName = args[1]; const password = args[2]
                if(!userConfig.password) {
                    return message.reply("You didn't set a password yet, you need to register one using !register <password> <backup-password> <?hint for password>!")
                } else if(passwordToAcessDB !==  userConfig.password) {
                    return message.reply("Wrong password, please, try again.")
                } else {
                    const accObj = userConfig.data
                    if(accObj.length >= 1) {
                        accObj.filter((item) => {
                            if(accountName.includes(item.account)) {return rps = "duplicated"}
                            else if(accObj.length >= 9 && userConfig.premium === false) {return rps = "limited"}
                        })
                        if(rps === "limited") {
                            return message.reply("You've reached the maximum of 10 free accounts, please, consider upgrading to premium or try deleting an account")
                        } else if(rps === "duplicated") {
                            return message.reply("Duplicated entry, please, use another name for this account.")
                        }
                        const sk = randomBytes(32); const iv = randomBytes(16)
                        const cipher = createCipheriv("aes-256-cbc", sk , iv)
                        let encryptedData = cipher.update(password, "utf-8", "hex"); encryptedData += cipher.final("hex")

                        const dataToInsert = [{"account" : accountName, "passwordCrypt" : encryptedData, "sk": sk, "iv": iv}]
                        await userSchema.findOneAndUpdate({userID: message.author.id}, {$addToSet: {data: dataToInsert}})
                        const encryptedEmbed = new MessageEmbed()
                            .setColor("RANDOM")
                            .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
                            .setDescription(`✅ - Encrypted:\n\`\`\`Account Name: ${accountName}\nEncrypted Password: ${encryptedData}\`\`\`\n**DO NOT** share with anyone your Encrypted Password!`)
                        return message.reply({ embeds: [encryptedEmbed] })
                    } else if(accObj.length < 1){
                        const sk = randomBytes(32); const iv = randomBytes(16)
                        const cipher = createCipheriv("aes-256-cbc", sk , iv)
                        let encryptedData = cipher.update(password, "utf-8", "hex")
                        encryptedData += cipher.final("hex")
                        const dataToInsert = [{"account" : accountName, "passwordCrypt" : encryptedData, "sk": sk, "iv": iv}]
                        await userSchema.findOneAndUpdate({userID: message.author.id}, {$addToSet: {data: dataToInsert}})
                        const encryptedEmbed = new MessageEmbed()
                            .setColor("RANDOM")
                            .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
                            .setDescription(`✅ - Encrypted:\n\`\`\`Account Name: ${accountName}\nEncrypted Password: ${encryptedData}\`\`\`\n**DO NOT** share with anyone your Encrypted Password!`)
                        return message.reply({ embeds: [encryptedEmbed] })
                    }
                }
            }
        }

    }
}