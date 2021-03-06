const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const reqString = {
    type: String,
    required: true
}
const accountSchema = new mongoose.Schema({
    account: String,
    password: String
})
const UserSchema = new mongoose.Schema({
    userID: String,
    password: String,
    backupPassword: String,
    language: String,
    prefix: String,
    premium: Boolean,
    data: Array
})

module.exports = mongoose.model("User", UserSchema)