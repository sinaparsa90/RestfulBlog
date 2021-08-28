let express= require("express"),
mongoose = require("mongoose"),
app = express(),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer");


// APP CONFIG
mongoose.connect("mongodb://localhost/restfulblog2",{useNewUrlParser: true, useUnifiedTopology: true})
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(expressSanitizer());


//Mongoose MODEL config

let blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date , default:Date.now}
});

let Blog = mongoose.model("Blog", blogSchema)

// RESTful ROUTES
app.get("/", function(req,res){
    res.redirect("/blogs")
})

// Blog.create({
//     title: "test blog",
//     image: "https://www.google.com/search?q=cat+images&sxsrf=ALeKk02vj-X9K9iiBjmnx7i8fQFcoeQl8Q:1629629408860&tbm=isch&source=iu&ictx=1&fir=UM_eL7wgIA4TzM%252Cht29CcN2-zkCmM%252C_&vet=1&usg=AI4_-kQRhllS-HZW_I_atM6qxGLlLw5eZA&sa=X&ved=2ahUKEwip7Z7QusTyAhU1mFwKHdtFAVIQ9QF6BAgPEAE#imgrc=UM_eL7wgIA4TzM",
//     body: "This is the first sample one",
// });



app.get("/blogs", function(req,res){
    Blog.find({}, function(err,blogs){
        if(err){
            console.log("ERROR!")
        }else{
            res.render("index", {blogs: blogs})
        }
    })
});

// NEW Route

app.get("/blogs/new", function(req, res){
    res.render("new")
});

app.post("/blogs/new", function(req, res){
    console.log(req.body)
    req.body.body = req.sanitize(req.body.blog.body);
    console.log(req.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new")
        }else{
            res.redirect("/blogs")
        }
    })
});






app.listen("3000", function(){
    console.log("restfulblog2 is running")
});