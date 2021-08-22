const userSchema = require('../configs/database/schemas/userSchema')
module.exports = {
    aliases:[], description: "",
    run:async(client,messageCreate,args) => {
        const userConfig = await userSchema.findOne({userID: messageCreate.author.id})
        const accObj = userConfig.data.toObject()
        const account = args[1]
        const filtered = accObj.filter(item => {
            if(account.includes(item.account)) {
                
            }
        })
    }
}