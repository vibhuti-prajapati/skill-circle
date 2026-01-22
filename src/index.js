import express from "express";

const app = express();

// request handler
app.use(
  "/user3",
  (req, res) => {
    res.send("hello vibhuti");
  },
  (req, res) => {
    res.send("second response");
  },
);

app.use(
  "/user",
  (req, res, next) => {
    res.send("hello vibhuti");
    next();
  },
  (req, res) => {
    console.log("2nd response");
    res.send("second response");
  },
);

app.use(
  "/user1",
  (req, res, next) => {
    next();
    res.send("hello vibhuti");
  },
  (req, res) => {
    console.log("2nd response");
    res.send("second response");
  },
);

app.use(
  "/user2",
  (req, res, next) => {
    next();
  },
  (req, res) => {},
);

app.use(
  "/user4",
  (req, res) => {
    res.send("hello vibhuti");
  },
  (req, res) => {
    res.send("second response");
    next();
  },
  (req, res) => {
    res.send("third response");
  },
  (req, res) => {
    res.send("fourth response");
  },
);
app.use(
  "/user5",
  (req, res) => {
  },
  (req, res,next) => {
    next();
  },
  (req, res) => {
    res.send("third response");
  },
  (req, res) => {
    res.send("fourth response");
  },
);

app.use(
  "/user6",
  (req, res,next) => {
    next();
  },
  (req, res,next) => {
    next();
  },
  (req, res) => {
    res.send("third response");
  },
  (req, res) => {
    res.send("fourth response");
  },
);

app.listen(3001, () => {
  console.log("server running on port 3001");
});
