const { faker } = require('@faker-js/faker');
const mysql=require('mysql2');
const express=require("express");
const path=require("path");
const methodOverride=require("method-override");
let app=express();

// to make connection our node with sql (server)
const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'nodeDB',
    password:'SQLMY'
});

// inserting data into table
// let q="insert into user(id,username,email,password) values ?";
// let user=[
//            ["2","ajay@1234","ajay@yahooo.com","123345"],
//            ["3","rohit@1234","rohith@gmail.com","32147"]
//          ];

// inserting fake data into table using faker 
// let q="insert into user(id,username,email,password) values ?";
let   getRandomUser=()=>{
    return [
      faker.string.uuid(),
      faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password()
      
    ]
  }

// for get data from post request that is send as a post request
app.use(express.urlencoded({extended:true}));

// form can only send request get and post , to convert other type request
app.use(methodOverride("_method"));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

// serving static files
app.use(express.static(path.join(__dirname,"public")));

app.listen("8080",()=>{
    console.log("app is listening at port 8080");
});
// home route
app.get("/",(req,res)=>{
    let q="select count(*) from user";
    try
    {
     connection.query(q,(err,result)=>{
        if(err){
            throw err;

        }
        let count=result[0]["count(*)"]; // only value not object
        res.render("home.ejs",{count});        
        });
    }
catch(err){
    console.log(err);
    res.send("Something error in DB");
}
});
// show route 
app.get("/user",(req,res)=>{
    let q="select * from user";
    try
    {
     connection.query(q,(err,users)=>{
        if(err)
          throw err;
        res.render("showUsers.ejs",{users});        
        });
    }
    catch(err){
    console.log(err);
    res.send("Something error in DB");
    }
});
// edit route -> update route
app.get("/user/:id/edit",(req,res)=>{
    let {id}=req.params;
    let q=`select * from user where id='${id}'`;
    try
    {
     connection.query(q,(err,result)=>{
        if(err)
          throw err;
        let user=result[0];
        res.render("edit.ejs",{user});
        });
    }
    catch(err){
    console.log(err);
    res.send("Something error in DB");
    }
});
// update route
app.patch("/user/:id",(req,res)=>{
    let {id}=req.params;
    let {password:formPass,username:newUsername}=req.body;
    let q=`select * from user where id='${id}'`;
    try
    {
     connection.query(q,(err,result)=>{
        if(err)
          throw err;
        let user=result[0];
        if(formPass!=user.password)
           res.send("Wrong password");
        else 
           {
              let q2=`update user set username='${newUsername}' where id='${id}'`;
              connection.query(q2,(err,result)=>{
                   if(err)
                      throw err;
                   res.redirect("/user");
              });
           }
        });
    }
    catch(err){
    console.log(err);
    res.send("Something error in DB");
    }
});
// add route
app.post("/user",(req,res)=>{
    let q="insert into user(id,username,email,password) values (?,?,?,?)";
    let newData=getRandomUser();
    try
    {
        connection.query(q,newData,(err,result)=>{
                if(err) 
                  throw err;
                res.redirect("/user");
        });
    }
    catch(err){
        console.log(err);
        res.send("can't Added in DB");
    }
   
   
});
// delete route
app.get("/user/:id/delete",(req,res)=>{
    let {id}=req.params;
    let q=`select * from user where id='${id}'`;
        try
        {
            connection.query(q,(err,result)=>{
                if(err)
                  throw err;
                let user=result[0];
                res.render("delete.ejs",{user});
                
            });
        }
        catch(err){
            console.log(err);
            res.send("Some Error Occured");
        }
});
 app.delete("/user/:id",(req,res)=>{
   
        let {id}=req.params;
        let {username:formName,password:formPass}=req.body;
        let q=`select * from user where id='${id}'`;
        try
        {
            connection.query(q,(err,result)=>{
                if(err)
                  throw err;
                let user=result[0];
                if(user.username==formName && user.password==formPass)
                  {
                     let q2=`delete from user where id='${id}'`;
                     try
                     {
                        connection.query(q2,(err,result)=>{
                                if(err)
                                   throw err;
                                res.redirect("/user");
                        });
                     }
                     catch(err){
                        console.log(err);
                        res.send("Can't Delete");
                     }
                  }
                else 
                  res.send("Invalid Username or password!!");
                
            });
        }
        catch(err){
            console.log(err);
            res.send("Some Error Occured");
        }
        
 });
 app.delete("/user",(req,res)=>{
    let q="truncate user";
    try
    {
        connection.query(q,(err,result)=>{
            if(err)
              throw err;
            res.redirect("/user");
        });
    }
    catch(err){
        console.log(err);
        res.send("Something went wrong..");
    }

   
 });





  
