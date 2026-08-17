require("dotenv").config()
const connectToDB = require("./src/config/db.js")
const app = require("./src/app.js")

connectToDB()
app.listen(3000, ()=>{
    console.log("server is listening on port 3000");
    
})