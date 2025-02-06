const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require('path');
// for the styling we have new ejs-mate
const ejsMate = require('ejs-mate');
// for patch and delete metod
const methodOverride = require('method-override')  // to do we have to install the npm override function
// to use override
app.use(methodOverride("_method"));
// requiring the error wrapasync function
const wrapAsync = require("./utils/WrapAsync.js");
// express error
const ExpressError = require("./utils/ExpressError.js");
// server side validation schema
const {listingSchema} = require("./schema.js")


app.set('view engine' , 'ejs');
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended : true}));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname , "public")));   

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
// to call the main function
main().then(() => {
    console.log("connected to Db")
}).catch((err) => {
    console.log(err);
});
app.get('/' , (req , res) => {
    res.send("Hi! i am root");
});

// function of the listingSchema as a middleware
const validateListing = (req , res , next) => {
    let {error} = listingSchema.validate(req.body);
        if(error){
            let erMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400 , erMsg);
        }else{
            next();
        }
}

//Index Route

app.get('/listings' ,wrapAsync(async (req , res) => {
    const allListings = await Listing.find({});     
    res.render("listings/index.ejs" , {allListings} );
}));

//New Route
// linking od create
app.get('/listings/new',(req , res) => {
    res.render('listings/new.ejs');
})


//Show route

app.get('/listings/:id' ,wrapAsync(async (req , res) => {
    let{id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs" , {listing});
}));

//create route

app.post('/listings' ,validateListing, wrapAsync(async (req , res , next  ) =>{
    // let{title , discription , image ,price, location , country} = req.body;
    // here there aree a simpler wayt to write this in new.ejs
    // If the client will not have any data the error will rase 
    // this if statement will face this for error in sort the server wiil not stop

        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect('/listings');

}));

// edit route

app.get('/listings/:id/edit' , wrapAsync(async (req , res) => {
    let{id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing})
}));

// update route

app.put('/listings/:id' ,validateListing, wrapAsync(async (req , res) => {
    let{id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

// Delete route

app.delete('/listings/:id' , wrapAsync(async (req , res) => {
    let{id} = req.params;
    let deleatedList = await Listing.findByIdAndDelete(id);
    console.log(deleatedList);
    res.redirect('/listings');
}));
// // tis is the sample data to check the collection is form or not
// app.get('/testlistening' , async (req , res) => {
//     let sampleListening = new Listing({
//         title : "My new villa",
//         description : "By the villa / or rent it",
//         price : 12000,
//         localtion : "Calangute , Goa",
//         country : "India",
//     });

//     await sampleListening.save();
//     console.log("collection is forming...");
//     res.send("add the listening");
// })

// page not found 
app.all("*" , (req , res , next) => {
    next(new ExpressError(404 , "Page not found..!!"))
});



//Error handler Middle 
app.use((err, req , res, next) => {
    let {statusCode = 500 , message = "Something Went Wrong" } = err;
    res.status(statusCode).render('listings/error.ejs' , {message});
    // res.status(statusCode).send(message);
})

app.listen(8080 , () => {
    console.log("server connect successfull...")
});


