import express from "express";

const app = express();

// request handler
/*
  NOTE:
  Express route paths written as strings are NOT regular expressions.
  In newer versions of Express (using path-to-regexp internally),
  characters like (), ?, +, * have special meaning and cannot be used
  as regex groups inside a string route.

  Writing "/u(s)?er" causes the router to fail while parsing the route,
  resulting in a startup crash:

  If pattern matching is required, use:
    - a real RegExp route: app.get(/^\/u(s)?er$/, ...)
    - or define multiple explicit routes instead.
*/

app.get("/u(s)?er",  (req,res)=>{
    res.send({name : "vibhuti"});
});
app.post("/user", (req,res)=>{
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

