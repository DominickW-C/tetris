//import functions
import * as pieces from "./pieces.js";
import * as main from "./main.js";

//checks to see if piece is touching the wall or another piece
export function isTouchingWallOrPiece() {
    for (let xx = 0; xx < pieces.currentXY.length; xx ++) {
        //checks if touching wall
        if (pieces.currentXY[xx][0] == 0 && main.currentKey == "ArrowLeft") {
            return true;
        }
        if (pieces.currentXY[xx][0] == 360 && main.currentKey == "ArrowRight") {
            return true;
        }

        //checks if touching piece
        for (let placedIndex = 0; placedIndex < pieces.XYcords.length; placedIndex ++) {
            if (pieces.currentXY[xx][1] == pieces.XYcords[placedIndex][1]) {
                if (pieces.currentXY[xx][0] + 40 == pieces.XYcords[placedIndex][0]) {
                    return true;
                }
                if (pieces.currentXY[xx][0] - 40 == pieces.XYcords[placedIndex][0]) {
                    return true;
                }
            }
        }
    }
    return false;
}

export function isTouchingbottom() {
    for (let yy = 0; yy < pieces.currentXY.length; yy ++) {
        if (pieces.currentXY[yy][1] == 760) {
            return true;
        }
    }
    return false
}

//compares the cords together, if x != returns false, if true then checks y
//helper function to isTouchingPiece
function compareCords(list1, list2) {
    let yCompare = 0;
    for (let com =  0; com < list1.length; com ++) {
        if ((list1[com]) != (list2[com] - yCompare)) {
            return false;   
        }
        yCompare += 40;
    } 
    return true
}

//goes through the list of cords to see if any of the places pieces are matching with the current piece
export function isTouchingPiece () {
    //loops through current pieces block cords
    for (let curVar = 0; curVar < pieces.currentXY.length; curVar ++) {
        //loops through the placed pieces block cords
        for (let totalVar = 0; totalVar < pieces.XYcords.length; totalVar ++) {      
            if (compareCords(pieces.currentXY[curVar], pieces.XYcords[totalVar]) == true) {
                return true;
            }
        }
    }
    return false;
}
//helper funtion to isFullLine
function checkLine (yVal) {
    let totalBlocks = 0;
    for (let blockCords = 0; blockCords < pieces.XYcords.length; blockCords ++) {
        if (yVal == pieces.XYcords[blockCords][1]) {
            totalBlocks += 1;
        }
        
    }
    if (totalBlocks == 10) {
        return true;
    }
    return false;
}

//redraws the shape down
function redraw(redrawCords) {
    let block = new pieces.block(redrawCords[2], redrawCords[0], redrawCords[1]);
    block.drawBlock();
}

//everytime a line is cleared moves blocks above it down one
function moveCollisionDown(highestLine) {
    for (let index = 0; index < pieces.XYcords.length; index ++) {
        if (pieces.XYcords[index][1] < highestLine) {
            let clearBlock = new pieces.block(pieces.XYcords[index][2], pieces.XYcords[index][0], pieces.XYcords[index][1]);
            clearBlock.clearBlock();
            pieces.XYcords[index][1] += 40;
        }
    }
}

//checks for a completed line
export function isFullLine () {
    let linesCleared = [];
    for (let yy = 760; yy >= 0; yy -= 40) {
        if (checkLine(yy) == true) {
            linesCleared.push(yy);
            pieces.clearRow(yy);
            pieces.removeFromCords(yy);
            moveCollisionDown(yy);
            isFullLine();
        }
    }
    for (let index = 0; index < pieces.XYcords.length; index ++) {
        redraw(pieces.XYcords[index]);
    }
    pieces.removeDupes();
}

//checks for a game over whenever a block is placed
export function isGameOver() {
    if (pieces.XYcords[pieces.XYcords.length - 1][1] < 0) {
        let gameOverScreen = document.getElementById("gameOverBack");
        gameOverScreen.style.display = "block";
        //spits an error out but if it ain't broke don't fix? 
        cancelAnimationFrame();
    }
}