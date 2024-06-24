//imports
import * as pieces from "./pieces.js";
import * as collision from "./collision.js";
import * as rotate from "./rotatePiece.js";

//starting variables
let currentX = 160;
let currentY = 0;
let condition = "create";
let level = 250;
let rotationIndex = 0;
let alreadyHold = false;
export let pieceIndex = Math.floor(Math.random() * 7);
export let currentKey = "";

//array containing all the pieces
export const pieceArray = [
    rotate.tRotations,
    rotate.lineRotations,
    rotate.lRotations,
    rotate.backLRotations,
    rotate.zigzagRotations,
    rotate.backZigzagRotations,
    rotate.squareRotations
];

pieceArray[pieceIndex][rotationIndex](currentX, currentY, condition);

//reads key presses and moves the piece
function keyPress(keyEvent) {
    let key = keyEvent["key"];

    if (key == "ArrowLeft") {
        currentKey = key;
        if (collision.isTouchingWallOrPiece() == false) {
            clearPrev();
            currentX -= 40;
            pieceArray[pieceIndex][rotationIndex](currentX, currentY, condition);
        }
    }
    if (key == "ArrowRight") {
        currentKey = key;
        if (collision.isTouchingWallOrPiece() == false) {
            clearPrev();
            currentX += 40;
            pieceArray[pieceIndex][rotationIndex](currentX, currentY, condition);
        }
    }

    if (key == "ArrowUp") {
        clearPrev();
        //makes sure it does not go off the screen on the sides when rotating
        if (currentX == 0) {
            currentX += 40;
        }
        else if (currentX == 360) {
            currentX -= 40;
        }
        //iterates through the list of different rotations
        if (rotationIndex != 3) {
            rotationIndex ++;
        } else {
            rotationIndex = 0;
        }
        pieceArray[pieceIndex][rotationIndex](currentX, currentY, condition);
    }

    //debugging only
    if (key == "ArrowDown") {
        level = 25;
    }

    if (key == " ") {
        clearPrev(); 
        quickDrop();
    }

    if (key == "c") {
        if (alreadyHold == false) {
            pieces.holdPiece(pieceIndex);
            alreadyHold = true;
        } else {
            console.log("already holding a piece");
        }
    }
}

document.addEventListener("keydown", keyPress);
document.addEventListener("keyup", (event) => {
    if (event["key"] == "ArrowDown") {
        level = 250;
    }
});

//logic behind a quickdrop
let resetCondition = "a";
export function quickDrop () {
    pieceArray[pieceIndex][rotationIndex](currentX, currentY, condition);
    for (let yCordIndex = 0; yCordIndex < pieces.currentXY.length; yCordIndex ++) {
        if (collision.isTouchingbottom() == false && collision.isTouchingPiece() == false) {
            clearPrev();
            return quickDrop(currentY += 40);
        }
    }
    pieceArray[pieceIndex][rotationIndex](currentX, currentY, condition);
    resetCondition = "b";
    return resetPiece(resetCondition);
}

//clears the past block
function clearPrev () {
    condition = "clear";
    pieceArray[pieceIndex][rotationIndex](currentX, currentY, condition);
    condition = "create";
}

//appends the array of places pieces
function XYappend () {
    for (let xy = 0; xy < pieces.currentXY.length; xy ++) {
        pieces.XYcords.push([pieces.currentXY[xy][0], pieces.currentXY[xy][1], pieces.currentColor[xy]]);
    }
}

//resets piece if touching bottom or touching another piece
//will also call a function to see if a line needs clearing,
//remove duplicate blocks (drawing shapes sometimes has overlap)
//check for a game over
export function resetPiece (condition) {
    //regular check
    if (condition == "a") {
        if (collision.isTouchingbottom() == true || collision.isTouchingPiece() == true) {
            XYappend();
            pieces.removeDupes();
            collision.isFullLine();  
            collision.isGameOver();
            currentY = -40;
            currentX = 160;
            rotationIndex = 0;
            pieceIndex = Math.floor(Math.random() * 7);
            alreadyHold = false;
        }
    }
    //if a quick drop happens calls this so a duplicate check doesn't happen
    else if (condition == "b") {
        if (collision.isTouchingbottom() == true || collision.isTouchingPiece() == true) {
            XYappend();
            pieces.removeDupes();
            collision.isFullLine();  
            collision.isGameOver();
            currentY = -40;
            currentX = 160;
            rotationIndex = 0;
            pieceIndex = Math.floor(Math.random() * 7);
            alreadyHold = false;
        }
        resetCondition = "c"
    }
    else if (condition == "c") {
        resetCondition = "a"
    }
    //resets if you hold a piece
    else if (condition == "d") {
        clearPrev();
        pieces.removeDupes(); 
        currentY = -40;
        currentX = 160;
        rotationIndex = 0;
        if (pieces.holdIndex == -1) {
            pieceIndex = Math.floor(Math.random() * 7);
        } else {
            pieceIndex = pieces.holdIndex;
        }
    }
}

//moves the piece down
export function update () {
    setTimeout(() => {
        requestAnimationFrame(update);
        resetPiece(resetCondition);
        clearPrev();
        currentY += 40; 
        pieceArray[pieceIndex][rotationIndex](currentX, currentY, condition);
    }, level)
}

update();