const mongoose = require("mongoose")


async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("connected to Database");
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectToDB