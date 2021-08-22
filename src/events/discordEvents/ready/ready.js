const db = require('../../../configs/database/db')
module.exports = async(client) => {
    await db
    console.log(`${client.user.username}`)
}