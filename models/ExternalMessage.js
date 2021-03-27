const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    id: {type: String, required: true, unique: true},
    decoded: {type: Schema.Types.Mixed},
    created_at:{type: Number}
});

module.exports = model('ExternalMessage', schema)