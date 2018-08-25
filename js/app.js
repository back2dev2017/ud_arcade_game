// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -80;
    this.y = 68;
    this.speed = 30;
    this.runrow = 1;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // note: dt that is passed is a "fractional" value (e.g. 0.018). So, multiply it by the "speed" of the specific bug. This 
    // means that slower computers will have larger dt values, which will result in larger "moves" of speed. The end effect
    // is that bugs will appear to the user to go across the screen at the same pace regardless of PC speed/power.
    allEnemies.forEach(function(bug) {
        bug.x = bug.x + (bug.speed * dt);
        // if the bug has moved off the canvas, put them back to a starting point to the "left" of the canvas.
        bug.x = bug.x > document.getElementById("canvas_area").width + 70 ? bug.x = -50 : bug.x;
    });
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player_class {
    constructor() {
        // note: only 1 player in game at a time. So can put all properties, methods in here with little or no
        // inefficiencies, etc.

        // no specs given on grid, but it appears from another file (engine.js) that each block is 101px wide by 83px tall
        // there are 6 rows (y-coord) and 5 columns (x-coord)
        this.xpos = (2 * 101) + 1;
        this.ypos = (5 * 83) + 1;
        this.sprite = 'images/char-boy.png';
        this.ctximage = new Image();
        this.ctximage.src = this.sprite;
        // recall "arrays" - and thus grid positions - are 0-based
        this.nowrow = 5;
        this.nowcol = 2;
        this.won = false;
        this.numTreasures = 0;
    }
    
    render () {
        ctx.drawImage(this.ctximage, this.xpos, this.ypos);
    }
    handleInput (direction) {
        switch(direction) {
            case 'up':
                // if in top row, can't go higher
                if (player.ypos < 80) {
                } else {
                    player.ypos -= 83;
                    player.nowrow -= 1;
                }
                break;
            case 'down':
                // if in bottom row, can't go lower
                if (player.ypos > (5 * 83)) {
                } else {
                    player.ypos += 83;
                    player.nowrow += 1
                }
                break;
            case 'left':
                // if in far left column, can't go left
                if (player.xpos < 100) {
                } else {
                    player.xpos -= 101;
                    player.nowcol -= 1;
                }
                break;
            case 'right':
                // if in far right column, can't go right
                if (player.xpos > (4 * 101)) {
                } else {
                    player.xpos += 101;
                    player.nowcol += 1;
                }
                break;
            default:
        }
        // console.log('row: ' + player.nowrow + ', col: ' + player.nowcol);
        // now, check to see if the user made it to the water (the top row)
        if (player.ypos < 80) {
            this.won = true;
        }
    }
    winmsg () {
        console.log('the player won');
    }
    resetPos () {
        this.xpos = (2 * 101) + 1;
        this.ypos = (5 * 83) + 1;
        this.nowrow = 5;
        this.nowcol = 2;
        this.won = false;
        this.numTreasures = 0;
    }
}

class Treasure_class {
    constructor() {
        // set up properties that each treasure will have
        this.xpos = 0;
        this.ypos = 0;
        // set row, col coords to make for simpler compare to avatar position
        this.row = 0;
        this.col = 0;
        this.sprite = "";
        this.grabbed = false;
    }
    genPos () {
        //   want to randomize location on canvas. Note: when instantiating class, need to check for
        // overlaps: do not want images to overlap/stack. So this may be called several times to 
        // create a new location
        //   recall there are 3 rows, 5 cols each, where treasures can be placed. Calculation the "cell" uses
        // 101px for width and 83px for height.
        //   recall placements rows start "1 row down" (aka, do not put treasures in water)
        this.row = Math.floor(Math.random() * 3) + 1;
        this.col = Math.floor(Math.random() * 5);

        // also, in shrinking images, need to do differing offsets... wow... so much coding because of bad graphics
        this.ypos = (this.row * 83) + 35;
        this.xpos = (this.col * 101) + 15;
    }
    render () {
        // if the player "grabbed" the treasure, do not render it again
        if (this.grabbed === false) {
            // cripes! images of treasures are too big.... <sigh>
            ctx.drawImage(Resources.get(this.sprite), this.xpos, this.ypos, 70, 90);
        }
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

let allEnemies = [];
// Note: bug images are not the full 83px in height. Thus the special offset of 68 below
for (let i=0; i < 3; i++) {
    // note: setting this up for the possibility of creating > 3 bugs running
    allEnemies[i] = new Enemy();
    let subi = i % 3;
    switch(subi) {
        case 0:
            allEnemies[i].x = allEnemies[i].x + Math.floor(Math.random() * 505);
            allEnemies[i].speed = allEnemies[i].speed + Math.floor(Math.random() * 40);
            break;
        case 1:
            allEnemies[i].x = allEnemies[i].x + Math.floor(Math.random() * 200);
            allEnemies[i].y = (83 * 1) + 68;
            allEnemies[i].speed = allEnemies[i].speed + 10 + Math.floor(Math.random() * 50);
            allEnemies[i].runrow = 2;
            break;
        case 2:
            allEnemies[i].x = allEnemies[i].x + Math.floor(Math.random() * 400);
            allEnemies[i].y = (83 * 2) + 68;
            allEnemies[i].speed = allEnemies[i].speed + 10 + Math.floor(Math.random() * 25);;
            allEnemies[i].runrow = 3;
            break;
        default:
            break;
    }
}

let player = new Player_class();

let allTreasures = [];

//   going to put instances of each treasure into the allTreasures array for easier drawing. But note that each treasure has
// a unique image, thus this for loop is somewhat a waste. But in the end it could also allow for multiple treasures that
// use the same image, etc.
//   want this to be a global function
function genTreasures() {
    allTreasures = [];
    for (let i = 0; i < 5; i++) {
        allTreasures[i] = new Treasure_class();
        let subi = i % 5;
        switch(subi) {
            case 0:
                allTreasures[i].sprite = "images/gem-green.png";
                break;
            case 1:
                allTreasures[i].sprite = "images/gem-blue.png";
                break;
            case 2:
                allTreasures[i].sprite = "images/star.png";
                break;
            case 3:
                allTreasures[i].sprite = "images/key.png";
                break;
            case 4:
                allTreasures[i].sprite = "images/heart.png";
                break;
            default:
                break;
        }
        let isOK = false;
        let loopHalt = 1;
        do {
            allTreasures[i].genPos();
            isOK = checkTreasurePos(allTreasures, allTreasures[i].xpos, allTreasures[i].ypos, i);
            loopHalt += 1;
        } while (isOK === false && loopHalt <= 100); // infinite loop protection: only going to try 100 times then just quit
    }
}

function checkTreasurePos(treasArr, chkX, chkY, newItemIndex) {
    let goodVal = false;
    for (let [index, item] of treasArr.entries()) {
        if (index == newItemIndex) {
            // do not check, the new item would of course have the same xpos, ypos
        } else {
            if (item.xpos == chkX && item.ypos == chkY) {
                goodVal = false;
                break; // if any item had the same xpos, ypos we need to stop and notify
            } else {
                goodVal = true;
            }
        }
    }
    return goodVal;
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

