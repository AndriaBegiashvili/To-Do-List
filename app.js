import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.set('strictQuery', false);

mongoose.connect("mongodb+srv://test:testtest@cluster0.0jxzadb.mongodb.net/todolistDB");

const itemSchema = {
  name: String
}
const Item = mongoose.model("Item", itemSchema);

const d1 = new Item({
  name: "Welcome to my To Do List"
});
const d2 = new Item({
  name: "Take Notes Here"
});
const d3 = new Item({
  name: "< Hit this to delete an item!"
});

const defaultItems = [d1, d2, d3]

const listSchema = {
  name: String,
  items: [itemSchema]
}

const List = mongoose.model("List",listSchema)



app.get("/", function (req, res) {

  Item.find({}, (err, foundItems) => {

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err)
        } else {
          console.log("yea")
        }
      })
      res.redirect("/")
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  })


});

app.post("/", function (req, res) {

  const itemname = req.body.newItem;
  const item = new Item ({
    name:itemname
  });
  item.save()
  res.redirect("/")
});

app.post("/delete",(req,res)=>{
  const checkedItemId = req.body.checkbox
  Item.findByIdAndDelete(checkedItemId,(err)=>{
    if(err){
      console.log(err)
    }else{
      console.log("yasna")
      res.redirect("/")
    }
  })
  
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
