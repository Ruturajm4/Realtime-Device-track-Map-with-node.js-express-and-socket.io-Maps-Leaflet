const express = require("express")
const app=express();
const path=require("path")
const http = require("http")
const socketio = require("socket.io")
const server = http.createServer(app)
const io = socketio(server)

//Setup ejs
app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")))

io.on("connection", function (socket){

//accept the location that is sent by the frontend from (script.js) i.e imported into (index.ejs) file
    socket.on("send-location", function (data){

//recive and send back to the frontend the users who are connected to them
        io.emit("receive-location", {id: socket.id, ...data})
    })

//send back to frontend when user gets disconnected
    socket.on("disconnect", function (){
        io.emit("user-disconnected", socket.id)
    })
})

app.get("/", function (req, res){
    res.render("index")
})

server.listen(1000)