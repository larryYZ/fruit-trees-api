//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb+srv://Larry-admin:Empnew123@clusteralpha.5lsp9.mongodb.net/FruitTreeDB?retryWrites=true&w=majority");

const appleTreeSchema = {
  variety: String,
  zone: Number,
  taste: String,
  bloom: String,
  harvest: String,
  description: String
}; 

const AppleTree = mongoose.model("AppleTree", appleTreeSchema);


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested, Content-Type, Accept Authorization"
  )
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "POST, PUT, PATCH, GET, DELETE"
    )
    return res.status(200).json({})
  }
  next()
});

app.route("/appleTrees")

.get(function(req, res){
  AppleTree.find(function(err, foundAppleTrees){
    if(!err){
      res.send(foundAppleTrees);
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res){

  const newAppleTree = new AppleTree({
    variety: req.body.variety,
    zone: req.body.zone,
    taste: req.body.taste,
    bloom: req.body.bloom,
    harvest: req.body.harvest,
    description: req.body.description
  });

  newAppleTree.save(function(err){
    if (!err){
      res.send("Successfully added a new variety.")
    } else{
      res.send(err);
    }

  })
});




app.route("/appleTrees/:appleTreeVariety")
.get(function(req, res){
  AppleTree.findOne({variety: req.params.appleTreeVariety}, function(err, foundAppleTree){
    if (foundAppleTree) {
      res.send(foundAppleTree);
    } else {
      res.send("Nothing found");
    }
  })
})

.put(function(req, res){

  AppleTree.update(
    {variety: req.params.appleTreeVariety},
    { variety: req.body.variety,
      zone: req.body.zone,
      taste: req.body.taste,
      bloom: req.body.bloom,
      harvest: req.body.harvest,
      description: req.body.description
    },
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated " + req.body.variety);
      }
    }
  );
})

.patch(function(req, res){

   AppleTree.update(
     {title: req.params.appleTree},
     {$set: req.body},
     function(err){
       if(!err){
         res.send("successfully updated " + req.body.variety);
       }
     }
   );
})

.delete(function(req, res){

  AppleTree.deleteOne(
    {title: req.params.appleTreeVariety},
    function(err){
      if(!err){
        res.send("Successfully deleted " + req.params.appleTreeVariety);
      } else {
        res.send(err);
      }
    }
  );

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){
  console.log("Server has started successfully.");
});
