const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Using options object handles the '@' in the password correctly without manual encoding
        const conn = await mongoose.connect("mongodb+srv://cluster0.i6n4hdi.mongodb.net/AverqonLearn?appName=Cluster0", {
            user: "muneeswaranmd2004",
            pass: "Munees2004"
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
