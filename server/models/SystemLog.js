const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['info', 'warning', 'error', 'success'],
        default: 'info'
    },
    userId: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const SystemLog = mongoose.model('SystemLog', systemLogSchema);

module.exports = SystemLog;
