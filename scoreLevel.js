//init score and level canvas
let scoreCanvas = document.getElementById("score");
let scoreContext = scoreCanvas.getContext("2d");
let levelCanvas = document.getElementById("level");
let levelContext = levelCanvas.getContext("2d");
scoreContext.font = "25px times";
levelContext.font = "25px times";

//writes to screen labels and base score/level (THE PARTS THAT DONT CHANGE)
export let score = 0;
scoreContext.fillText("Score:", 5, 25);
levelContext.fillText("Level: ", 5, 28);

//write to the screen the parts that will update
export let displayLevel = [0];
export function updateScoreLevel() {
    scoreContext.clearRect(5, 30, 160, 200);
    levelContext.clearRect(70,0, 200, 60);
    scoreContext.fillText(score, 5, 65);
    levelContext.fillText (displayLevel[0], 75, 28);
}

//adds to the score based on what happened
//if numbers than it was for line clears
//ADD SOMETHING FOR IF YOU SOFT DROP PIECES
export function addScore(forWhat) {
    scoreContext.clearRect(5, 30, 160, 200);
    if (forWhat == "quickDrop") {
        score += 50;
    }
    else if (forWhat == 1) {
        score += (40 * (level + 1));
    }
    else if (forWhat == 2) {
        score += (100 * (level + 1));
    }
    else if (forWhat == 3) {
        score += (300 * (level + 1));
    }
    else if (forWhat == 4) {
        score += (1200 * (level + 1));
    }
}