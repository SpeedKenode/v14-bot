const mongoose = require("mongoose");
const mongodb = process.env.mongodburl;

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.log(`${client.user.tag} is online.`);

        if (!mongodb) return;

        await mongoose.connect(mongodb || "", {
            keepAlive: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        if (mongoose.connect) {
            console.log("The database is connecting")
        }
    },
};