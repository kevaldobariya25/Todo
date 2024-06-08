import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app= express();
const port= 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

// Connecting to database
const db = new pg.Client({
    host: 'ep-nameless-band-a1nvjh5a.ap-southeast-1.aws.neon.tech',
    database: 'todo',
    user: 'todo_owner',
    password: 'Q4Fq9oXriLbG',
    port: 5432,
    ssl: {
      rejectUnauthorized: false, // This should be configured according to your security requirements
    },
  });
  
  db.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Connection error', err.stack));
// Get home page
app.get("/", async(req, res)=>{
    try{
        let result= await db.query("SELECT * FROM tasks ORDER BY id ASC");
        let tasks= result.rows; // console.log(tasks);
        res.render("index.ejs", {tasks: tasks});
    } catch(err){
        console.log("err: ",err);
    }
});

// Add Task
app.post("/add", async(req, res)=>{
    let addTask= req.body.newTask;
    try{
        await db.query("INSERT INTO tasks (title) VALUES($1) ;",[addTask]);
        res.redirect("/");
    } catch(err){
        console.log("err: ",err);
    }
});

// Update Task
app.post("/edit", async(req, res)=>{
    let id= req.body.updatedTaskId;
    let newTask= req.body.updatedTaskTitle;
    try{
        await db.query("UPDATE tasks SET title=$1 WHERE id=$2 ;",[newTask, id]);
        res.redirect("/");
    } catch(err){
        console.log("err: ",err);
    }
});

// Delete Task
app.post("/delete", async(req, res)=>{
    let id= req.body.deleteTaskId;
    try{
        await db.query("DELETE FROM tasks WHERE id=$1 ;",[id]);
        res.redirect("/");
    } catch(err){
        console.log("err: ",err);
    }
});

// Server Listening
app.listen(port, ()=>{
    console.log(`Listening on server ${port}`);
});