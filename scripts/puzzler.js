(function () {
    "use strict";

    // Keeps track of the blank square
    var blankSquare = {
    	xPosition: 300,
    	yPosition: 300,
    	id: "3and3"
    };

    // Checks if the puzzle is being shuffled
    var shuffling = false;

    // Sets up shuffle and creates the puzzle when page loads	
    window.onload = function () {
        document.querySelector("#controls").onclick = shuffle;

        createPuzzle();
    };

    // This method creates the puzzle and sets up the image area
    // accordingly
    function createPuzzle() {
        var puzzle = document.querySelector("#puzzlearea");
        var x = -1;
        var y = -1;
        for (var i = 0; i < 15; i++) {
            var piece = document.createElement("div");
            x++;
            if (i % 4 == 0) {
                x = 0;
            }
            if ((i + 1) % 4 == 1) {
                y++;
            }
            piece.id = x + "and" + y;
            piece.style.backgroundPosition = getPosition(x, y);
            piece.style.top = y * 100 + "px";
            piece.style.left = x * 100 + "px";
            piece.innerHTML = i + 1;
            piece.classList.add("puzzlepiece");
            piece.onclick = swap;
            piece.onmouseenter = color;
            piece.onmouseout = unColor;
            puzzle.appendChild(piece);
        }
    }

    // This method returns the background position 
    function getPosition(x, y) {
        x *= -100;
        y *= -100;
        return x + "px " + y + "px";
    }

    // This method shuffles the puzzle u by repeatedly moving
    // pieces into the blank square over and over
    function shuffle() {
    	shuffling = true;
    	document.querySelector("#output").innerHTML = "";
    	for (var i = 0; i < 1000; i++) {
    		var positions = blankSquare.id.split("and");
    		var row = positions[0];
    		var col = positions[1];
    		var neighbors = getNeighbors(row, col);
    		var size = neighbors.length;
    		var rand = Math.floor(Math.random() * size);
    		move(neighbors[rand]);
    	}
    }

    // This method returns all the valid neighbors of the blank square
    function getNeighbors(row, col) {
    	var neighbor1 = document.getElementById((parseInt(row) + 1) + "and"+ col);
    	var neighbor2 = document.getElementById((parseInt(row) - 1) + "and"+ col);
    	var neighbor3 = document.getElementById(row + "and" + (parseInt(col) + 1));
    	var neighbor4 = document.getElementById(row + "and" + (parseInt(col) - 1));
    	var neighbors = [neighbor1, neighbor2, neighbor3, neighbor4];
    	// Remove the squares that don't exist
    	for (var i = 0; i < 4; i++) {
    		// if it is null, remove the first element
    		if (!neighbors[0]) {
    			neighbors.shift();
    		} else { // not null, move it to the end of the array
    			neighbors.push(neighbors.shift());
    		}
    	}
    	return neighbors;
    }

    // This method returns true if a given square is movable
    // and false otherwise. A square is movable if it directly
    // neighbors the blank square. 
    function isMovable(piece) {
    	var left = parseInt(window.getComputedStyle(piece).left);
    	var top = parseInt(window.getComputedStyle(piece).top);
    	return (Math.abs(left - blankSquare.xPosition) === 100 &&
            top - blankSquare.yPosition === 0) ||
            (Math.abs(top - blankSquare.yPosition) === 100 &&
            left - blankSquare.xPosition === 0);
    }

    // This method swaps the current square with the blank suare when
    // clicked. 
    function swap() {
    	shuffling = false;
    	var display = document.querySelector("#output");
    	if (isMovable(this)) {
    		move(this);
	    }
	    if (isSolved()) {
    		display.innerHTML = "Congrats, kid. ur a winner! (not really)";
    	} else {
    		display.innerHTML = "";
    	}
    }

    // This function moves the piece to the blank square
    function move(piece) {
    	var oldX = parseInt(window.getComputedStyle(piece).left);
        var oldY = parseInt(window.getComputedStyle(piece).top);
        var positions = piece.id.split("and");
        var oldRow = positions[0];
        var oldCol = positions[1];
        piece.id = blankSquare.id;
        piece.style.top = blankSquare.yPosition + "px";
        piece.style.left = blankSquare.xPosition + "px";
        blankSquare.xPosition = oldX;
        blankSquare.yPosition = oldY;
        blankSquare.id = oldRow + "and" + oldCol;
    }

    // This method highlights the border and text of a movable piece
    // when user hovers over it
    function color() {
    	if (isMovable(this)) {
    		this.classList.add("movable");
    	}
    }

    // This method removes the red bordering and text olor of a movable 
    // piece when user stops hovering over it
    function unColor() {
    	this.classList.remove("movable");
    }

    // This method returns true if the puzzle is in a solved state
    // and false otherwise
    function isSolved() {
    	var pieces = document.querySelectorAll("#puzzlearea div");
    	var x = -1;
        var y = -1;
    	for (var i = 0; i <pieces.length; i++) {
    		x++;
            if (i % 4 == 0) {
                x = 0;
            }
            if ((i + 1) % 4 == 1) {
                y++;
            }
            if (pieces[i].id !== x + "and" + y && !shuffling) {
            	return false;
            }
    	}
    	return true;
    }

})();