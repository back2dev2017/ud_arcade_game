/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make 
 * writing app.js a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        gamePause = false,
        gameStart,
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    canvas.setAttribute("id", "canvas_area");
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);

        // update timer - did not put withing update() because it purposed "dt", which we do not want to use'
        document.getElementById("elapsed_time").innerText = `${((Date.now() - gameStart)/1000).toFixed(1)}`;

        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        if (gamePause === false) {
            lastTime = now;
            win.requestAnimationFrame(main);
        }
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;
        
        // Before drawing, clear existing canvas
        ctx.clearRect(0,0,canvas.width,canvas.height)

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
        renderEntities();
        checkHits();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        // loop through treasures and render - do this first so bugs go "over" them
        allTreasures.forEach(function(treas){
            treas.render();
        });
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        player.render();

        if (player.won === true) {
            // reached the water, want to pause the game, display a message, etc
            let windiv = document.getElementById("msg_div");
            let wintxt = document.getElementById("win_rslt");
            let ouchtxt = document.getElementById("ouch_rslt");
            let canele = document.getElementById("canvas_area");
            windiv.style.left = canele.offsetLeft + "px";
            wintxt.style.display = "flex";
            ouchtxt.style.display = "none";
            windiv.style.display = "flex";
            gamePause = true;
            document.getElementById("timer_box").classList.add("hidden");
            document.getElementById("game_time").innerText = document.getElementById("elapsed_time").innerText;
            document.getElementById("treas_count").innerText = player.numTreasures;
        }
    }

    function checkHits() {
        //   This checks to see if any of the bugs have hit our avatar. A simple check would be looking at the grid element (row/col) of
        // bugs and avatar. But for visual appeal, will attempt to use direct comparison of image positions.
        //   The image of the avatar is 101px wide and 171px tall. Not sure if this was an intentional bad design (the actual image is much
        // smaller than that), or if this was a test for students to burn time looking at avatar details. But it significantly complicates
        // the check for a "hit" (edges of image are not true edges of the actual avatar image). After working with an image editor it
        // appears the avatars have an actual size of 77w x 85h. Centered horizontally but not vertically - it is about 60px from the top
        // (really? <sigh>). The bug image is 75px from its top. How infuriating.... I was tempted to redo all the <bleep>ing graphics, 
        // but it was unclear if this was allowed for the project. So after burning a TON of time messing with pixel offsets and crap, I
        // decided to simply track the row/col values directly (e.g. row 3, col 2). The bugs just run across a row, so can simplify the
        // check by row, and will do a little bit of pixel checking for left/right. Bugs are 101px wide
        // 
        allEnemies.forEach(function(bug) {
            let bughit = false;
            if (bug.runrow == player.nowrow) {
                if ((bug.x <= player.xpos + 12 && bug.x + 101 >= player.xpos + 12) ||
                    (bug.x <= player.xpos + 12 + 77 && bug.x + 101 >= player.xpos + 12 + 77) ||
                    (bug.x >= player.xpos + 12 && bug.x + 101 <= player.xpos + 12 + 77)) {
                        bughit = true;
                        console.log('ouch');
                    }
            }
            if (bughit === false) {
                // no bug hit, see if the player grabbed a treasure
                allTreasures.forEach(function(treas) {
                    // check row/col position. if not already grabbed, set the treasure object to show grabbed and increment
                    // the player treasure count
                    if ((treas.row === player.nowrow && treas.col === player.nowcol) && 
                        treas.grabbed === false) {
                        treas.grabbed = true;
                        player.numTreasures += 1;
                    }
                });
            } else {
                // well... got hit.... display a message for the user
                let windiv = document.getElementById("msg_div");
                let wintxt = document.getElementById("win_rslt");
                let ouchtxt = document.getElementById("ouch_rslt");
                let canele = document.getElementById("canvas_area");
                windiv.style.left = canele.offsetLeft + "px";
                wintxt.style.display = "none";
                ouchtxt.style.display = "flex";
                windiv.style.display = "flex";
                gamePause = true;
                document.getElementById("timer_box").classList.add("hidden");
                // gotta reset the game
                reset();
            }
        });
    }

    /* This function essentially resets objects and variables (re-randomizing in some cases). But note
     * that it does NOT "start" the game again immediately. The button "restart_btn" click is where
     * the game is restarted (refer to the .addEventListener for "restart_btn")
     */
    function reset() {
        player.resetPos();
        gameStart = Date.now();
        genTreasures();
        document.getElementById("timer_box").classList.remove("hidden");
        // noop
    }

    /* Go ahead and load all of the images we know we're going to need to draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     * unclear some file names were capitalized with a space, bad consistency, so I renamed them (lowercase, hyphen)
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/gem-green.png',
        'images/gem-blue.png',
        'images/gem-orange.png',
        'images/heart.png',
        'images/key.png',
        'images/star.png',
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;

    document.getElementById("restart_btn").addEventListener('click', function(evt) {
        let windiv = document.getElementById("msg_div");
        windiv.style.display = "none";
        gamePause = false;
        reset();
        win.requestAnimationFrame(main);
    });

})(this);
