import express from "express";

const app = express();

// request handler
app.use("/hello", (req, res)=>{
    res.send("hello from server"); 
});

app.listen(3001, ()=>{
    console.log("server running on port 3001");
});

