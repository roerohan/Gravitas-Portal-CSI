const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//Connect mongodb at default port 27017 in a DB called UserDB. You can change the name of the DB here.
mongoose.connect('mongodb://localhost:27017/GravitasDB', {
    useNewUrlParser: true,
    useCreateIndex: true,
}, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded.')
    } else {
        console.log('Error in DB connection: ' + err)
    }
});
