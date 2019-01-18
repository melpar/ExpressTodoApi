var express = require("express");
const bodyParser = require('body-parser')

var app = express();
// app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser())

tasks = [];
app.listen(3000, ()=>{
    console.log("server running on port 3000");
})

const Sequelize = require('sequelize');
const sequelize = new Sequelize('todos','username', 'password',{
  dialect: 'sqlite',
  storage: 'database.sqlite'
}); 


const Todos = sequelize.define('todo',{
    name: Sequelize.STRING,
    updatedAt: Sequelize.DATE,
    createdAt: Sequelize.DATE
});

const Items = sequelize.define('items',{
    content: Sequelize.STRING,
    completed: Sequelize.BOOLEAN,
});

Items.belongsTo(Todos)
Todos.hasMany(Items)

sequelize.sync()

app.get("/api/todo", (req, res)=>{
    Todos.findAll({
        include: [{
            model: Items
        }]
    }).then(todos=> {
        res.json(todos);
    });
})

app.put("/api/todo/:id", (req, res)=>{
    toAdd = {name : req.body.name, updatedAt : new Date}
    Todos.update(toAdd, {where : {id : req.params.id}});
    res.status(200).json("update ok");
})

app.post("/api/todo/:id/item", (req, res)=>{
    newItem = {todoId : req.params.id, content : req.body.content, completed : req.body.completed}; 
    Items.create(newItem)
    res.status(200).json("create item ok");   
})

/*app.put("/api/todo/:id/item/:idItem", (req, res)=>{
    sequelize.sync().then(()=>{
        completed = true;
        if(req.body.completed === "false") completed = false;
        newItem = {idItem : parseInt(req.body.idItem,10), content : req.body.content, completed : completed};
        items.create({items : newItem});
        res.status(200).json("update ok");
        
    })
})*/

app.post("/api/todo", (req, res)=>{
    toAdd = {name : req.body.name, updatedAt : null, createdAt : new Date(), items : []}
    Todos.create(toAdd);
    res.status(200).json("post ok")
})

app.delete("/api/todo/:id", (req, res)=>{

    Todos.destroy({where : {id:req.params.id}});
    res.status(200).json("delete ok");
    
})
/*
app.delete("/api/todo/item/:id", (req, res)=>{
    Items.destroy({where : {'items.id':req.params}});
    res.status(200).json("delete item ok");
})*/

app.get("/api/todo/:id",(req, res)=>{
    value = req.params.id;
    Todos.find({where : {
        id : value
    }}).then(todos=> {
        res.json(todos);
    });
})