//imports
import * as pieces from "./pieces.js";
import * as collision from "./collision.js";
import * as rotate from "./rotatePiece.js";
import * as score from "./scoreLevel.js";

//starting variables
let storeLevelForSoftDrop = 800;
let currentX = 160;
let currentY = 0;
let condition = "create";
export let totalLinesCleared = [0];
let level = 800;
let rotationIndex = 0;
let alreadyHold = false;
export let shadow = [false];
export let pieceIndex = Math.floor(Math.random() * 7);
export let currentKey = "";
export let upcomingPiece = [
    Math.floor(Math.random() * 7),
    Math.floor(Math.random() * 7),
    Math.floor(Math.random() * 7)
];

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

pieces.drawUpcoming();
pieceArray[pieceIndex][rotationIndex](currentX, currentY, condition);
//stops square shadoow from being drawn in the ground
if (pieceIndex == 6) {
    drawShadow(720, true);
} else {
    drawShadow(760, true);
}

//reads key presses and moves the piece
function keyPress(keyEvent) {
    let key = keyEvent["key"];

    if (key == "ArrowLeft") {
        currentKey = key;
        if (collision.isTouchingWallOrPiece() == false) {
            drawShadow(0, false);
            clearPrev();
            currentX -= 40;
            pieceArray[pieceIndex][rotationIndex](currentX, currentY, condition);
            drawShadow(0, true);
        }
    }
    if (key == "ArrowRight") {
        currentKey = key;
        if (collision.isTouchingWallOrPiece() == false) {
            drawShadow(0, false);
            clearPrev();
            currentX += 40;
            pieceArray[pieceIndex][rotationIndex](currentX, currentY, condition);
            drawShadow(0, true);
        }
    }

    if (key == "ArrowUp") {
        drawShadow(0, false);
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
        drawShadow(0, true);
    }

    if (key == "ArrowDown") {
        level = 25;
    }

    if (key == " ") {
        clearPrev(); 
        quickDrop();
        score.addScore("quickDrop");
    }

    if (key == "c") {
        if (alreadyHold == false) {
            drawShadow(0, false);
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
        level = storeLevelForSoftDrop;
    }
});

//logic behind a quickdrop
//POSSIBILITY OF COMBINING QUICK DROP AND SHAWDOW
let resetCondition = "a";
function quickDrop () {
    pieceArray[pieceIndex][rotationIndex](currentX, currentY, condition);
    for (let yCordIndex = 0; yCordIndex < pieces.currentXY.length; yCordIndex ++) {
        if (collision.isTouchingbottom(0) == false && collision.isTouchingPiece(0) == false) {
            clearPrev();
            return quickDrop(currentY += 40);
        }
    }
    pieceArray[pieceIndex][rotationIndex](currentX, currentY, condition);
    resetCondition = "b";
    return resetPiece(resetCondition);
}

//logic behind drawing a shadow piece (where to start checkiing, if it is drawing or erasing)
export function drawShadow (moveDownY, draw) {
    if (draw == true) {
        condition = "create";
    } else {
        condition = "clear";
    }
    shadow[0] = true;
    pieces.transparency[0] = "33";
    for (let yCordIndex = 0; yCordIndex < pieces.currentXY.length; yCordIndex ++) {
        if (collision.isTouchingbottom(moveDownY) == false && collision.isTouchingPiece(moveDownY) == false) {
            return drawShadow(moveDownY + 40, draw);
        }
    }
    pieceArray[pieceIndex][rotationIndex](currentX, currentY + moveDownY, condition);
    shadow[0] = false;
    pieces.transparency[0] = "FF";
}

//clears the past block
function clearPrev () {
    condition = "clear";
    pieceArray[pieceIndex][rotationIndex](currentX, currentY, condition);
    pieceArray[pieceIndex][rotationIndex](currentX, currentY + shadow, condition);
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
let res = false; 
export function resetPiece (condition) {
    //regular check
    if (condition == "a") {
        if (collision.isTouchingbottom(0) == true || collision.isTouchingPiece(0) == true) {
            XYappend();
            pieces.removeDupes();
            collision.isFullLine();  
            collision.isGameOver();
            currentY = -40;
            currentX = 160;
            rotationIndex = 0;
            pieceIndex = upcomingPiece[0];
            upcomingPiece.splice(0, 1);
            upcomingPiece.push(Math.floor(Math.random() * 7));
            alreadyHold = false;
            pieces.drawUpcoming();
            res = true; 
        }
    }
    //if a quick drop happens calls this so a duplicate check doesn't happen
    else if (condition == "b") {
        if (collision.isTouchingbottom(0) == true || collision.isTouchingPiece(0) == true) {
            XYappend();
            pieces.removeDupes();
            collision.isFullLine();  
            collision.isGameOver();
            currentY = -40;
            currentX = 160;
            rotationIndex = 0;
            pieceIndex = upcomingPiece[0];
            upcomingPiece.splice(0, 1);
            upcomingPiece.push(Math.floor(Math.random() * 7));
            alreadyHold = false;
            pieces.drawUpcoming();
            res = true;
        }
        resetCondition = "c";
    }
    else if (condition == "c") {
        resetCondition = "a";
    }
    //resets if you hold a piece
    else if (condition == "d") {
        clearPrev();
        pieces.removeDupes(); 
        currentY = -40;
        currentX = 160;
        rotationIndex = 0;
        if (pieces.holdIndex == -1) {
            pieceIndex = upcomingPiece[0];
            upcomingPiece.splice(0, 1);
            upcomingPiece.push(Math.floor(Math.random() * 7));
        } else {
            pieceIndex = pieces.holdIndex;
        }
        pieces.drawUpcoming();
        res = true;
    }
}

function drawAfterReset () {
    if (res == true) {
        drawShadow(0, true);
        res = false
    }
}

//sees if enough lines were cleared to go up a level 
function checklevelUpdate(totalLinesCleared) {
    switch (totalLinesCleared) {
        case 10:
            level = 716;
            storeLevelForSoftDrop = 716;
            score.displayLevel[0] = 1;
            break;
        case 20:
            level = 633;
            storeLevelForSoftDrop = 633;
            score.displayLevel[0] = 2;
            break;
        case 30:
            level = 550;
            storeLevelForSoftDrop = 550;
            score.displayLevel[0] = 3;
            break;
        case 40:
            level = 466;
            storeLevelForSoftDrop = 466;
            score.displayLevel[0] = 4;
            break;
        case 50:
            level = 383;
            storeLevelForSoftDrop = 383;
            score.displayLevel[0] = 5;
            break;
        case 60:
            level = 300;
            storeLevelForSoftDrop = 300;
            score.displayLevel[0] = 6;
            break;
        case 70:
            level = 216;
            storeLevelForSoftDrop = 216;
            score.displayLevel[0] = 7;
            break;
        case 80:
            level = 133;
            storeLevelForSoftDrop = 133;
            score.displayLevel[0] = 8;
            break;
        case 90:
            level = 100;
            storeLevelForSoftDrop = 100;
            score.displayLevel[0] = 9;
            break;
        case 100:
            level = 83;
            storeLevelForSoftDrop = 83;
            score.displayLevel[0] = 10;
            break;
        case 130:
            level = 67;
            storeLevelForSoftDrop = 67;
            score.displayLevel[0] = 11;
            break;
        case 160:
            level = 50;
            storeLevelForSoftDrop = 50;
            score.displayLevel[0] = 12;
            break;
        case 190:
            level = 33;
            storeLevelForSoftDrop = 33;
            score.displayLevel[0] = 13;
            break;
        default:
            break;
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
        drawAfterReset();
        score.updateScoreLevel();
        checklevelUpdate(totalLinesCleared[0]);
    }, level)
}

update();