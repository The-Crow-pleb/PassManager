const moongose = require('mongoose')
module.exports = moongose.connect('mongodb://localhost:27017/passwordManager', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    keepAlive: true,
    useFindAndModify: false,
    autoIndex: false
})