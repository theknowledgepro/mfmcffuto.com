import mongoose from 'mongoose'

const ContactFormSchema = new mongoose.Schema({
    uniqueID: { type: Number },
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    details: { type: String },
    read: { type: Boolean, default: false },
}, { timestamps: true })

const DB = mongoose.connection.useDb('greenexperientials');

module.exports = DB.models.ContactForm || DB.model('ContactForm', ContactFormSchema)