const mongoose = require("mongoose");

// mongoose.connect("mongodb://127.0.0.1:27017/eCell");
const atlasConnectionString = "mongodb+srv://satyamvirat:kWRtNsnmoB3YjxlP@cluster0.dz6c8l5.mongodb.net/?retryWrites=true&w=majority";


mongoose.connect(atlasConnectionString);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
    console.log('MongoDb connected');
});

module.exports = db;