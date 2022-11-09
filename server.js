const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const db = require("./src/models");
const app = express();
dotenv.config()
const corsOptions = {
    origin: "*",
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', "GET,POST,DELETE,PUT,HEAD,OPTIONS")
    res.setHeader('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Authorization, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin")
    res.setHeader('Access-Control-Allow-Credentials', true)
    next();
})

app.get("/", (req, res) => {
    console.log("pass here", req);
    res.json({
        message: "Welcome to application."
    });
});

// db.sequelize.sync();
/**If existing tables need to dropped and the database resynced */
db.sequelize.sync({
    // force: true 
}).then(() => {
    console.log("Drop and re-sync db.");
});
require("./src/routes/router")(app);
const PORT = (process.env.PORT) || 3100;
app.listen(PORT, ()=>{
    console.log('RUNNING', PORT);
})


