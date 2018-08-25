# Simple Arcade game (like "Frogger")

## Table of Contents

* [Purpose](#purpose)
* [Instructions](#instructions)
* [Code Notes](#code-notes)
* [Contributing](#contributing)
* [Dependencies](#Dependencies)
* [References & Credits](#References-&-Credits)

## Purpose

This is a simple arcade style game. It was created mainly to become familiar with "animating" HTML canvas objects, as well as become 
familiar with some of the "class" type functionality of Javascript.

## Instructions

To install the game, the following files (with subfolder names) should be copied:

	+ index.html 
		js/app.js
		js/enjine.js
		js/resources.js
		css/style.css
		images/heart.png
		images/key.png
		images/rock.png
		images/Selector.png
		images/star.png
		images/char-boy.png
		images/char-cat-girl.png
		images/char-pink-girl.png
		images/char-princess.png
		images/enemy-bug.png
		images/gem-blue.png
		images/gem-green.png
		images/gem-orange.png
		images/grass-block.png
		images/stone-block.png
		images/water-block.png

To play the game, load index.html. Then use the arrow keys to move the avatar across the screen. Avoid being hit by the bugs and try to collect
treasures (e.g. gems, stars, keys, etc). If you make it to the water you win. If you get hit by a bug you have to start over.

Note: not all above image files are used in the game at this time. But at some point in the future other enhancements may be added (such as choosing
an avatar, displaying more treasures, etc). So it is recommended to copy all files.

## Code Notes

There is a bit of complexity with how the 3 Javascript files function (app.js, resourses.js, engine.js).

The resourses.js creates an object off the browser window that has functions to work with an internal array. That array loads in all the image
files and sets them up as new Image objects that can be immediately used in a canvas .drawImage() call.

The app.js file creates various object classes (some using the older "prototype" approach, some using the new "class" syntax). Then other global
variables (objects) and arrays are instanced from those classes.

The engine.js file is where the "real-time" processing is performed. Note the use of win.requestAnimationFrame(). It extensively accesses the
objects instanced from the app.js file. The main "engine" of engine.js is the "main()" function.

The code relies heavily on Immediately-invoked fuction expressions (IIFEs), so to understand the code flow/initialization, etc, you will need to
have a good understanding of IIFEs (I need to look closer at this myself as I tend to create a "main()" function and simply call it after I
know the document has loaded).

## Contributing

As this particular page is for a Udacity Nano degree program, no contributions will be accepted. No contributing instructions are provided

## Dependencies

No dependencies for frameworks or libraries are required. However, it is assumed the browser fully supports the ECMAScript 6 (ES6) "class" features.


## References & Credits

This project was cloned from https://github.com/udacity/frontend-nanodegree-arcade-game.git as per course instruction. The clone was modified
to implement the required functionality.

