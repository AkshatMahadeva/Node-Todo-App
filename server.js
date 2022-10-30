const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');


mongoose.connect("mongodb+srv://am:Anubhav2021@cluster0.m0abvpd.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }, (err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("conneted to the mongodb server.");
    }
});

let port = process.env.PORT;
if(port == null || port == ""){
    port = 3000;
}

app.listen(port, ()=>{
    console.log("App is running successfully.");
});

const itemShema = {
    title: String
}

const Item = mongoose.model("Item", itemShema);

const listShema = {
    name: String,
    items: [itemShema]
}

const List = mongoose.model("List", listShema);

app.get("/", (req, res)=>{
    List.find({}, (err, foundlist)=>{
        if(err){
            console.log(err);
        }
        else{
            if(foundlist.length === 0){
                // console.log("No List found");
            }
            else{
                // console.log(foundlist);
            }
            res.render("home", {lists: foundlist});   
        }
    });
});

app.post("/", (req, res)=>{
    const list = {
       name: req.body.list
    }
    List.insertMany(list, (err)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("item inserted successfully!");
        } 
    });
    res.redirect("/");
});

app.get("/:id", async (req, res)=>{
    const id = req.params.id;
    // console.log(id);
    List.findById(id, (err, list)=>{
        if(err){
            // console.log("List not found");
            res.redirect("/");
        }
        else{
            res.render("list", {list: list});
        }
    });
});

app.post("/:id/add", (req, res)=>{
    const id = req.params.id;
    // console.log(id);
    const body = req.body.item;
    const item = {
        title: body
    }
    List.findById(id, (err, foundlist)=>{
        if(err){
            console.log(err);
        }
        else{
            if(foundlist){
                foundlist.items.push(item);
                foundlist.save();
                res.redirect("/"+id);
            }
        }
    });
});

app.post("/:id/delete", (req, res)=>{
    const id= req.params.id;
    const checked = req.body.check;
    const itemId = req.body.itemId;
    console.log(checked, itemId);
    List.findOneAndUpdate({"_id": id}, {$pull: {items: {"_id": itemId}}}, (err)=>{
        if (!err){
            // console.log("Item deleted successfully!");
            res.redirect("/"+id);
        }
        else{
            console.log(err);
        }
    });

});

app.post("/list/:id/delete", (req, res)=>{
    const id = req.params.id;
    List.findByIdAndDelete(id, (err)=>{
        if(err){
            console.log(err);
        }
        else{
            // console.log("List deleted successfully!");
            res.redirect("/");
        }
    });

})
