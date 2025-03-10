import { resetPiece, upcomingPiece, shadow } from "./main.js";

//init canvas
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

let holdCanvas = document.getElementById("holdPiece");
let holdContext = holdCanvas.getContext("2d");

let nextPiecesCanvas = document.getElementById("nextPieces");
let nextPiecesContext = nextPiecesCanvas.getContext("2d");

let currentContext = context;

//changes outline width
currentContext.lineWidth = 3;

export let currentColor = [];
export let currentXY = [];
//[x, y, color]
export let XYcords  = [];

//removes duplicate pieces from array 
export function removeDupes() {
    for (let curIndex = 0; curIndex < XYcords.length; curIndex ++) {
        for (let compareIndex = curIndex + 1;  compareIndex < XYcords.length; compareIndex ++) {
            if (XYcords[curIndex][0] == XYcords[compareIndex][0]) { 
                if (XYcords[curIndex][1] == XYcords[compareIndex][1]) {
                    XYcords.splice(compareIndex, 1);
                }
            } 
        } 
    }
}

//removes pieces from array when a line is cleared
export function removeFromCords(yVal) {
    for (let index = 0; index < XYcords.length; index ++) {
        if (yVal == XYcords[index][1]) {
            XYcords.splice(index, 1);
            removeFromCords(yVal);
        }
    }
}

let storeIndex = -1;
export let holdIndex = storeIndex;
//helper function to both hold piece and draw upcoming
function drawWhich (whichPiece, ifHold, yValue) {
    let saveStore = storeIndex;
    currentContext.lineWidth = 3;
    if (whichPiece == 0) {
        tBlock1(60, yValue, "create");
        storeIndex = 0;
    }
    else if (whichPiece == 1) {
        line1(40, yValue - 10, "create");
        storeIndex = 1;
    }
    else if (whichPiece == 2) {
        lBlock1(60, yValue, "create");
        storeIndex = 2;
    }
    else if (whichPiece == 3) {
        backL1(60, yValue, "create");
        storeIndex = 3;
    }
    else if (whichPiece == 4) {
        zigzag1(60, yValue, "create");
        storeIndex = 4;
    } 
    else if (whichPiece == 5) {
        backZigzag1(60, yValue, "create");
        storeIndex = 5;
    } else {
        square(40, yValue - 30, "create");
        storeIndex = 6;
    }

    if (ifHold == false) {
        storeIndex = saveStore;
    }
}

//logic for holding pieces 
export function holdPiece(whichPiece) {
    holdIndex = storeIndex; 
    currentContext = holdContext;
    currentContext.clearRect(0, 0, 160, 160);
    drawWhich(whichPiece, true, 70);
    currentContext = context;
    resetPiece("d");
}

export function drawUpcoming(upcomingArray) {
    currentContext = nextPiecesContext;
    currentContext.clearRect(0, 0, 160, 520);
    let yy = 70;
    for (let index = 0; index < upcomingPiece.length; index ++) {
        drawWhich(upcomingPiece[index], false, yy);
        yy += 160;
    }
    currentContext = context;
}

//creates a single block / update block
export class block {

    constructor (color, currentX, currentY) {
        this.color = color;
        this.currentX = currentX; 
        this.currentY = currentY;
    }

    cords () {
        currentColor.push(this.color);
        currentXY.push([this.currentX, this.currentY]);
    }

    drawBlock () {
        currentContext.fillStyle = this.color;
        currentContext.fillRect(this.currentX, this.currentY, 40, 40);
        currentContext.strokeRect(this.currentX + 2, this.currentY + 2, 36, 36);
        if (shadow[0] == false) {
            this.cords();
        }
    }

    clearBlock () {
        currentContext.clearRect(this.currentX, this.currentY, 40 , 40);
        currentXY = [];
        currentColor = [];
    }
}

//used to create a shape
class createShape extends block {

    right (condition) {
        this.currentX += 40; 
        if (condition == "clear") {
            this.clearBlock();
        }
        else if (condition == "create") {
            this.drawBlock();
        }
    }
    
    left (condition) {
        this.currentX -= 40;
        if (condition == "clear") {
            this.clearBlock();
        }
        else if (condition == "create") {
            this.drawBlock();
        }
    }

    up (condition) {
        this.currentY -= 40;
        if (condition == "clear") {
            this.clearBlock();
        }
        else if (condition == "create") {
            this.drawBlock();
        }
    }
    
    down(condition) {
        this.currentY += 40;
        if (condition == "clear") {
            this.clearBlock();
        }
        else if (condition == "create") {
            this.drawBlock();
        }
    }
} 

export var transparency = ["FF"];
//functions that create a shape
//tblock rotations
export function tBlock1 (currentX, currentY, condition) {
    let origin = new createShape(`#b279d7${transparency[0]}`, currentX, currentY);
    if (condition == "create") {
        origin.drawBlock();
    }
    else if (condition == "clear") {
        origin.clearBlock();
    }
    origin.right(condition);
    origin.left(condition);
    origin.left(condition);
    origin.right(condition);
    origin.up(condition);
} 

export function tBlock2 (currentX, currentY, condition) {
    let origin = new createShape(`#b279d7${transparency[0]}`, currentX, currentY);
    if (condition == "create") {
        origin.drawBlock();
    }
    else if (condition == "clear") {
        origin.clearBlock();
    }
    origin.down(condition);
    origin.up(condition);
    origin.up(condition);
    origin.down(condition);
    origin.right(condition);
} 

export function tBlock3 (currentX, currentY, condition) {
    let origin = new createShape(`#b279d7${transparency[0]}`, currentX, currentY);
    if (condition == "create") {
        origin.drawBlock();
    }
    else if (condition == "clear") {
        origin.clearBlock();
    }
    origin.right(condition);
    origin.left(condition);
    origin.left(condition);
    origin.right(condition);
    origin.down(condition);
}

export function tBlock4 (currentX, currentY, condition) {
    let origin = new createShape(`#b279d7${transparency[0]}`, currentX, currentY);
    if (condition == "create") {
        origin.drawBlock();
    }
    else if (condition == "clear") {
        origin.clearBlock();
    }
    origin.left(condition);
    origin.right(condition);
    origin.down(condition);
    origin.up(condition);
    origin.up(condition);
}

export function line1 (currentX, currentY, condition) {
    let origin = new createShape(`#4cdfe1${transparency[0]}`, currentX, currentY)
    if (condition == "create") {
        origin.drawBlock();
    }
    else if (condition == "clear") {
        origin.clearBlock();
    }
    origin.left(condition);
    origin.right(condition);
    origin.right(condition);
    origin.right(condition);
}

//line rotations
export function line2 (currentX, currentY, condition) {
    let origin = new createShape(`#4cdfe1${transparency[0]}`, currentX, currentY)
    if (condition == "create") {
        origin.drawBlock();
    }
    else if (condition == "clear") {
        origin.clearBlock();
    }
    origin.down(condition);
    origin.down(condition);
    origin.down(condition);
}

//zigzag rotations
export function zigzag1 (currentX, currentY, condition) {
let origin = new createShape(`#ff243a${transparency[0]}`, currentX, currentY);
    if (condition == "create") {
        origin.drawBlock();
    }
    else if (condition == "clear") {
        origin.clearBlock();
    }
    origin.left(condition);
    origin.right(condition);
    origin.up(condition);
    origin.right(condition);
}

export function zigzag2 (currentX, currentY, condition) {
    let origin = new createShape(`#ff243a${transparency[0]}`, currentX, currentY);
        if (condition == "create") {
            origin.drawBlock();
        }
        else if (condition == "clear") {
            origin.clearBlock();
        }
        origin.up(condition);
        origin.down(condition);
        origin.right(condition);
        origin.down(condition);
}

export function zigzag3 (currentX, currentY, condition) {
    let origin = new createShape(`#ff243a${transparency[0]}`, currentX, currentY);
        if (condition == "create") {
            origin.drawBlock();
        }
        else if (condition == "clear") {
            origin.clearBlock();
        }
        origin.right(condition);
        origin.left(condition);
        origin.down(condition);
        origin.left(condition);
}

export function zigzag4 (currentX, currentY, condition) {
    let origin = new createShape(`#ff243a${transparency[0]}`, currentX, currentY);
        if (condition == "create") {
            origin.drawBlock();
        }
        else if (condition == "clear") {
            origin.clearBlock();
        }
        origin.left(condition);
        origin.up(condition);
        origin.down(condition);
        origin.right(condition);
        origin.down(condition);
}

//back zigzg rotations
export function backZigzag1 (currentX, currentY, condition) {
    let origin = new createShape(`#42f542${transparency[0]}`, currentX, currentY);
    if (condition == "create") {
        origin.drawBlock();
    }
    else if (condition == "clear") {
        origin.clearBlock();
    }
    origin.right(condition);
    origin.left(condition);
    origin.up(condition);
    origin.left(condition);
}

export function backZigzag2 (currentX, currentY, condition) {
    let origin = new createShape(`#42f542${transparency[0]}`, currentX, currentY);
    if (condition == "create") {
        origin.drawBlock();
    }
    else if (condition == "clear") {
        origin.clearBlock();
    }
    origin.down(condition);
    origin.up(condition);
    origin.right(condition);
    origin.up(condition);
}

export function backZigzag3 (currentX, currentY, condition) {
    let origin = new createShape(`#42f542${transparency[0]}`, currentX, currentY);
    if (condition == "create") {
        origin.drawBlock();
    }
    else if (condition == "clear") {
        origin.clearBlock();
    }
    origin.left(condition);
    origin.right(condition);
    origin.down(condition);
    origin.right(condition);
}

export function backZigzag4 (currentX, currentY, condition) {
    let origin = new createShape(`#42f542${transparency[0]}`, currentX, currentY);
    if (condition == "create") {
        origin.drawBlock();
    }
    else if (condition == "clear") {
        origin.clearBlock();
    }
    origin.up(condition);
    origin.down(condition);
    origin.left(condition);
    origin.down(condition);
}

//l block rotations
export function lBlock1 (currentX, currentY, condition) {
    let origin = new createShape(`#ffb629${transparency[0]}`, currentX, currentY);
    if (condition == "create") {
        origin.drawBlock();
    }
    else if (condition == "clear") {
        origin.clearBlock();
    }
    origin.left(condition);
    origin.right(condition);
    origin.right(condition);
    origin.up(condition);
}

export function lBlock2 (currentX, currentY, condition) {
    let origin = new createShape(`#ffb629${transparency[0]}`, currentX, currentY);
    if (condition == "create") {
        origin.drawBlock();
    }
    else if (condition == "clear") {
        origin.clearBlock();
    }
    origin.up(condition);
    origin.down(condition);
    origin.down(condition);
    origin.right(condition);
}

export function lBlock3 (currentX, currentY, condition) {
    let origin = new createShape(`#ffb629${transparency[0]}`, currentX, currentY);
    if (condition == "create") {
        origin.drawBlock();
    }
    else if (condition == "clear") {
        origin.clearBlock();
    }
    origin.left(condition);
    origin.down(condition);
    origin.up(condition);
    origin.right(condition);
    origin.right(condition);
}

export function lBlock4 (currentX, currentY, condition) {
    let origin = new createShape(`#ffb629${transparency[0]}`, currentX, currentY);
    if (condition == "create") {
        origin.drawBlock();
    }
    else if (condition == "clear") {
        origin.clearBlock();
    }
    origin.down(condition);
    origin.up(condition);
    origin.up(condition);
    origin.left(condition);
}

//back l block rotations
export function backL1 (currentX, currentY, condition) {
    let origin = new createShape(`#2c30c9${transparency[0]}`, currentX, currentY);
    if (condition == "create") {
        origin.drawBlock();
    }
    else if (condition == "clear") {
        origin.clearBlock();
    }
    origin.left(condition);
    origin.up(condition);
    origin.down(condition);
    origin.right(condition);
    origin.right(condition);
}

export function backL2 (currentX, currentY, condition) {
    let origin = new createShape(`#2c30c9${transparency[0]}`, currentX, currentY);
    if (condition == "create") {
        origin.drawBlock();
    }
    else if (condition == "clear") {
        origin.clearBlock();
    }
    origin.up(condition);
    origin.right(condition);
    origin.left(condition);
    origin.down(condition);
    origin.down(condition);
}

export function backL3 (currentX, currentY, condition) {
    let origin = new createShape(`#2c30c9${transparency[0]}`, currentX, currentY);
    if (condition == "create") {
        origin.drawBlock();
    }
    else if (condition == "clear") {
        origin.clearBlock();
    }
    origin.left(condition);
    origin.right(condition);
    origin.right(condition);
    origin.down(condition);
}

export function backL4 (currentX, currentY, condition) {
    let origin = new createShape(`#2c30c9${transparency[0]}`, currentX, currentY);
    if (condition == "create") {
        origin.drawBlock();
    }
    else if (condition == "clear") {
        origin.clearBlock();
    }
    origin.up(condition);
    origin.down(condition);
    origin.down(condition);
    origin.left(condition);
}

//square rotations (haha so funny)
export function square (currentX, currentY, condition) {
    let origin =  new createShape(`#f6ff29${transparency[0]}`, currentX, currentY);
    if (condition == "create") {
        origin.drawBlock();
    }
    else if (condition == "clear") {
        origin.clearBlock();
    }
    origin.right(condition);
    origin.down(condition);
    origin.left(condition);
}

export function clearRow (yVal) {
    let origin = new createShape("#f6ff29", 0, yVal);
    origin.clearBlock();
    origin.right("clear");
    origin.right("clear");
    origin.right("clear");
    origin.right("clear");
    origin.right("clear");
    origin.right("clear");
    origin.right("clear");
    origin.right("clear");
    origin.right("clear");
}