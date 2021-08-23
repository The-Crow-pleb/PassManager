const bcrypt = require("bcryptjs")
const {MessageEmbed} = require("discord.js")
const {createDecipheriv} = require("node:crypto")
const userSchema = require("../configs/database/schemas/userSchema")
module.exports = {
    aliases:[], description: "",
    run:async(client, messageCreate, args) => {
        //Just testing
        const message = messageCreate
        const {guild, member} = message
        const user = await userSchema.findOne({userID: message.author.id})
        const sk = user.data[0].sk.buffer; const iv = user.data[0].iv.buffer
        const decipher = createDecipheriv("aes-256-cbc", sk, iv)
        let decryptedData = decipher.update(user.data[0].passwordCrypt, "hex", "utf-8");

        decryptedData += decipher.final("utf8");

        console.log("Decrypted message: " + decryptedData);
    }
}