const mongoose = require('mongoose');

const workstationSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ['Active', 'Under Maintenance'],
        default: 'Active',
    },
});

const Workstation = mongoose.model('Workstation', workstationSchema);

module.exports = Workstation;