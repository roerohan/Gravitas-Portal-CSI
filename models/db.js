const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(`${process.env.MONGO_URL}/${process.env.MONGO_DB}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
}, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded.')
    } else {
        console.log('Error in DB connection: ' + err)
    }
});
