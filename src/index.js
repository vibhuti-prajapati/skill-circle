import express from "express";

const app = express();

// request handler

app.get("/user/:id",  (req,res)=>{
    console.log(req.params);
    res.send({name : "vibhuti"});
});
app.post("/user", (req,res)=>{
    console.log(req.query);
    res.send("posted");
} );
app.use("/hello", (req, res)=>{
    res.send("hello from server"); 
});
app.use("/" , (req,res)=>{
    res.send("hello vibhuti");
});
app.listen(3001, ()=>{
    console.log("server running on port 3001");
});

