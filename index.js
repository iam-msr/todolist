//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
//const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

  const itemsSchema = {
  name: String
  };

 const Item = mongoose.model("Item", itemsSchema);

 const item1 = new Item({
    name: "Welcome to your todolist!"
  });

  const defaultItems = item1;

app.get("/", function(req, res) {
  
  Item.find({}).then(function(foundItems)
  {
    if (foundItems.length === 0)
    { 
      Item.insertMany(defaultItems).then(function(){
        console.log("successfully loaded default items to DB.");
      })
      .catch(function(err){
        console.log(err);
      });
      res.redirect("/");
    }
    else
      {
        res.render("list", { listTitle: "Today", newListItems: foundItems });
      }
    
  })
  .catch(function(err){
    console.log(err);
  });

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  if (itemName.trim() === "") 
  {
    res.redirect("/");
  }
    else
  {
    const item = new Item({
      name: itemName
    });
    item.save();
    console.log("successfully saved a new item to DB.");
    res.redirect("/");
  }
  
});

app.post("/delete", function(req,res){
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId).then(function()
  {
      console.log("successfully deleted the checked item from DB.");
      res.redirect("/");
  });
  
  });


app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
