const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type :String,
        required : true,
    },
    description : String,
    // here the set was used when the blanck inge will pass by the user but we need to set the default value with help of default
    image: {
        type : String, 
        default : "https://images.unsplash.com/photo-1622960748096-1983e5f17824?q=80&w=1779&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        // here wee se a default link if the useer will not pass any inmage wee nee d to add the default one 
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1622960748096-1983e5f17824?q=80&w=1779&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D": v,

    },
    price : Number,
    location : String,
    country : String
})
// create model using the above schema
const Listing = mongoose.model('Listing' , listingSchema);


module.exports = (Listing);