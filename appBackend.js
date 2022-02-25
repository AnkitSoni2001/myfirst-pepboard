const express = require("express");  //access
const socket = require("socket.io"); //access

const app = express(); //Initialized and server ready

app.use(express.static("public"));

//creating port
let port = process.env.PORT || 5000;
let server = app.listen(port, () => {
    console.log("Listening to port" + port);
})

// connecting with server
let io = socket(server);

io.on("connection", (socket) => {
    console.log("Made socket connection");

    //Received data from frontend
    socket.on("beginPath", (data) => {
        // Now server transfer same data to all connected computer
        io.sockets.emit("beginPath", data);
    })

    socket.on("drawStroke", (data) => {
        io.sockets.emit("drawStroke", data);
    })
    socket.on("redoUndo", (data) => {
        io.sockets.emit("redoUndo", data);
    })
})