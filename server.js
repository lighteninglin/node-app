const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const app = express();

// 引入users.js
const users = require("./routes/api/users");
// 引入profiles.js
const profiles = require("./routes/api/profiles");
// DB config
const db = require("./config/keys").mongoURL;

// 使用body-parser中间件
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose.connect(db)
.then(() => console.log("MongoDB Connected."))
.catch(err => console.log("MongoDB connect failed.", err));

// 初始化passport
app.use(passport.initialize());
// 传递passport过去，这样可以不用在server.js写了
require("./config/passport")(passport);

// app.get("/",(req,res) => {
//     res.send("Hello World!");
// });

app.use("/api/users", users);
app.use("/api/profiles", profiles);

const port = process.env.PORT || 9797;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});