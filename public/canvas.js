// const { Socket } = require("engine.io");

let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let pencilColor = document.querySelectorAll(".pencil-colour");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");
let download = document.querySelector(".download");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

let penColor = "red";
let eraserColour = "white";
let penWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;

// Undo Redo Operation
let undoRedoTracker = [];  //Data contain
let track = 0; //Represent which action from tracker array


let mouseDown = false;

//API
let tool = canvas.getContext("2d");

tool.strokeStyle = penColor; //It give color to line
tool.lineWidth = penWidth; //It change width of line

// tool.beginPath(); //To create a new Graphic (path)(line)
// tool.moveTo(10,10); //start point
// tool.lineTo(100,150); //end point
// tool.stroke(); //To visible the line(Default in black)

//mousedown -> start new path, mousemove -> fill the (graphic)

///Using function

// pen control with mouse
canvas.addEventListener("mousedown", (e) => {
    mouseDown = true;

    let data = {
        x:e.clientX,
        y:e.clientY
    }
    //send data to server
    socket.emit("beginPath", data)
    
})

canvas.addEventListener("mousemove", (e) => {    
    if (mouseDown){
        let data = {
            x:e.clientX,
            y:e.clientY,
            color: eraserFlag ? eraserColour : penColor,
            width: eraserFlag ? eraserWidth : penWidth
        }
        socket.emit("drawStroke", data);
    }    
})

canvas.addEventListener("mouseup", (e) => {
    mouseDown = false;

    // Undo Redo Operation
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length - 1;
})

//begin path or starting ponit
function beginPath(strokeObj) {
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);
}

// Line draw krna
function drawStroke(strokeObj) {
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}

//Changing color of Pen
pencilColor.forEach((colorElem) => {
    colorElem.addEventListener("click", (e) => {
        let color = colorElem.classList[0];
        penColor = color;
        tool.strokeStyle = penColor;
    })
});


//Changing width of pencil
pencilWidthElem.addEventListener("change", (e) => {
    penWidth = pencilWidthElem.value;
    tool.lineWidth = penWidth;
})

//Changing width of eraser
eraserWidthElem.addEventListener("change", (e) => {
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth;
})

// control color of eraser (eraser-color -> white)
eraser.addEventListener("click", (e) => {
    if (eraserFlag) {
        console.log("Eraser clicked")
        tool.strokeStyle = eraserColour;
        tool.lineWidth = eraserWidth;
    } else {
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
})

//downloading image
download.addEventListener("click", (e) => {
    let url = canvas.toDataURL();

    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})

// undo redo action
undo.addEventListener("click", (e) => {
    if (track > 0) track--;

    // track action

    let data = {
        trackValue: track,
        undoRedoTracker
        }
    
       socket.emit("redoUndo",data);
    
})
redo.addEventListener("click", (e) => {
    if (track < undoRedoTracker.length - 1) track++;

    // track action

    let data = {
        trackValue: track,
        undoRedoTracker
        }
    
       socket.emit("redoUndo",data);
    
})
function undoRedoCanvas(trackObj) {
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    let url = undoRedoTracker[track];
    let img = new Image(); // new image reference element
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}


socket.on("beginPath", (data) => {
    // data -> data from server
    beginPath(data);
})

socket.on("drawStroke" , (data) => {
    drawStroke(data);
})

socket.on("redoUndo",(data) => {
    undoRedoCanvas(data);
})


//mousedown -> start new path, mousemove -> fill the (graphic)
// canvas.addEventListener("mousedown", (e) => {
    //     mouseDown = true;
    //     tool.beginPath();
//     tool.moveTo(e.clientX, e.clientY);
// })

// canvas.addEventListener("mousemove", (e) => {
//     if(mouseDown){
//         tool.lineTo(e.clientX, e.clientY);
//         tool.stroke();
//     }
// })

// canvas.addEventListener("mouseup", (e) =>{
//     mouseDown = false;
// })











