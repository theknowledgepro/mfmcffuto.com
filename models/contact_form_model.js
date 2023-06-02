import mongoose from 'mongoose'
const { SITE_DATA } = require('@/config');

const ContactFormSchema = new mongoose.Schema({
    uniqueID: { type: Number },
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    details: { type: String },
    read: { type: Boolean, default: false },
}, { timestamps: true })

const DB = mongoose.connection.useDb(SITE_DATA.MONGODB_DB_NAME);

module.exports = DB.models.ContactForm || DB.model('ContactForm', ContactFormSchema)