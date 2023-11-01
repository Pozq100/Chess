const pieces = ["rook","knight","bishop","queen","king","bishop","knight","rook"];
let selectedPiece;
const rules = {
    find_curr: function(piece) {
        const parentID = piece.parentNode.id;
        const currRow = parseInt(parentID[0]);
        const currCol = parseInt(parentID[1]);
        const currColor = (Array.from(piece.classList))[1];
        return { currRow, currCol, currColor};
    },
    rook_rule: function() {
        removeGreyCircle();
        const { currRow, currCol, currColor } = rules["find_curr"](this);
        // up is currRow - 1, down is currRow + 1, left is currCol - 1, right is currCol + 1
        function create(index,UpDown,iterate) {
            let toStay = "col";
            if (UpDown) toStay = "row";
            while (true) {
                index += iterate;
                let checkSquare;
                if (toStay == "row") checkSquare = document.getElementById(`${index}${currCol}`);
                else checkSquare = document.getElementById(`${currRow}${index}`)
                if (index < 0 || index > 7 || checkSquare.hasChildNodes()) break;
                // make a grey circle in the square
                let greyCircle = createGreyCircle();
                checkSquare.appendChild(greyCircle);
            }
        }
        // up
        create(currRow,true,-1);
        // down
        create(currRow,true,1);
        // right
        create(currCol,false,1);
        //left
        create(currCol,false,-1);
    },

    knight_rule: function() {
        removeGreyCircle();
        const { currRow, currCol, currColor } = rules["find_curr"](this);
        // i - 2: j - 1, j + 1
        // i - 1: j - 2, j + 2
        // i + 1: j - 2, j + 2
        // i + 2: j - 1, j + 1
        function create(row,iterateCol) {
            if (row < 0 || row > 7) return;
            let j1 = currCol - iterateCol;
            let j2 = currCol + iterateCol;
            let checkSquare;
            let greyCircle;
            checkSquare = document.getElementById(`${row}${j1}`);
            if (j1 >= 0 && !checkSquare.hasChildNodes()){
                greyCircle = createGreyCircle();
                checkSquare.appendChild(greyCircle);
            }
            checkSquare = document.getElementById(`${row}${j2}`);
            if (j2 < 8 && !checkSquare.hasChildNodes()) {
                greyCircle = createGreyCircle();
                checkSquare.appendChild(greyCircle);
            }
        }

        create(currRow - 2,1);
        create(currRow - 1,2);
        create(currRow + 2,1);
        create(currRow + 1,2);
    },

    bishop_rule: function() {
        removeGreyCircle();
        const { currRow, currCol, currColor } = rules["find_curr"](this);
        // i + 1, j - 1
        // i + 1, j + 1
        // i - 1, j - 1
        // i - 1, j + 1
        function create(row, col, iterateRow, iterateCol) {
            while(true) {
                row += iterateRow
                col += iterateCol
                checkSquare = document.getElementById(`${row}${col}`);
                if (row < 0 || row > 7 || col < 0 || col > 7 || checkSquare.hasChildNodes()) break;
                greyCircle = createGreyCircle();
                checkSquare.appendChild(greyCircle);
            }
        }

        create(currRow,currCol,1,-1);
        create(currRow,currCol,1,1);
        create(currRow,currCol,-1,-1);
        create(currRow,currCol,-1,1);

    },

    queen_rule: function() {
        removeGreyCircle();
        const { currRow, currCol, currColor } = rules["find_curr"](this);
        function createDiag(row, col, iterateRow, iterateCol) {
            while(true) {
                row += iterateRow
                col += iterateCol
                checkSquare = document.getElementById(`${row}${col}`);
                if (row < 0 || row > 7 || col < 0 || col > 7 || checkSquare.hasChildNodes()) break;
                greyCircle = createGreyCircle();
                checkSquare.appendChild(greyCircle);
            }
        }

        createDiag(currRow,currCol,1,-1);
        createDiag(currRow,currCol,1,1);
        createDiag(currRow,currCol,-1,-1);
        createDiag(currRow,currCol,-1,1);

        function createLine(index,UpDown,iterate) {
            let toStay = "col";
            if (UpDown) toStay = "row";
            while (true) {
                index += iterate;
                let checkSquare;
                if (toStay == "row") checkSquare = document.getElementById(`${index}${currCol}`);
                else checkSquare = document.getElementById(`${currRow}${index}`)
                if (index < 0 || index > 7 || checkSquare.hasChildNodes()) break;
                // make a grey circle in the square
                let greyCircle = createGreyCircle();
                checkSquare.appendChild(greyCircle);
            }
        }
        // up
        createLine(currRow,true,-1);
        // down
        createLine(currRow,true,1);
        // right
        createLine(currCol,false,1);
        //left
        createLine(currCol,false,-1);
    },

    king_rule: function() {
        removeGreyCircle();
        const { currRow, currCol, currColor } = rules["find_curr"](this);
        let topleftRow = currRow - 1;
        let topleftCol = currCol - 1;
        for (let i = 0; i < 3; i++) {
            let row = topleftRow + i;
            if (row >= 0 && row < 8){
                for (let j = 0; j < 3; j++) {
                    let col = topleftCol + j;
                    if (col >= 0 && col < 8) {
                        let checkSquare = document.getElementById(`${row}${col}`);
                        if (!checkSquare.hasChildNodes()) {
                            let greyCircle = createGreyCircle();
                            checkSquare.appendChild(greyCircle);
                        }
                    }
                }
            }
        }
        
    },

    pawn_rule: function() {
        removeGreyCircle();
        const { currRow, currCol, currColor } = rules["find_curr"](this);
        // at the start its able to move 2 squares or 1 squares
        if (currColor == "white") {
            let checkSquare = document.getElementById(`${currRow-1}${currCol}`);
            let greyCircle;
            if (!checkSquare.hasChildNodes()) {
                greyCircle = createGreyCircle();
                checkSquare.appendChild(greyCircle);
            }
            if (currRow == 6) {
                checkSquare = document.getElementById(`${currRow-2}${currCol}`);
                greyCircle = createGreyCircle();
                checkSquare.appendChild(greyCircle);
            }
        } else {
            let checkSquare = document.getElementById(`${currRow+1}${currCol}`);
            let greyCircle;
            if (!checkSquare.hasChildNodes()) {
                greyCircle = createGreyCircle();
                checkSquare.appendChild(greyCircle);
            }
            if (currRow == 1) {
                checkSquare = document.getElementById(`${currRow+2}${currCol}`);
                greyCircle = createGreyCircle();
                checkSquare.appendChild(greyCircle);
            }
        }
    }
};

function createGreyCircle() {
    let div = document.createElement("div");
    div.className = "greyCircle";
    return div
}

function removeGreyCircle() {
    let circles = document.querySelectorAll(".greyCircle");
    circles.forEach(function(element) {
        element.remove();
      });
}
function load() {
    let alt = -1
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let div = document.createElement("div");
            if (alt == 1) {
                div.classList = "blacksquare";
                alt *= -1;
            } else {
                div.classList = "whitesquare";
                alt *= -1;
            }
            div.classList.add("squares");
            div.id = `${i}${j}`;
            //setting up the baord
            // i = 0,1,6,7
            if (i == 0 || i == 1 || i == 6 || i == 7) {
                let createPiece = document.createElement("div");
                let currColor;
                let currPiece;
                if(i == 0 || i == 1) {
                    currColor = "black";
                } else {
                    currColor = "white";
                }
                if(i == 1 || i == 6) {
                    currPiece = "pawn";
                } else {
                    currPiece = pieces[j];
                }
                createPiece.className = "piece";
                createPiece.draggable = true;
                createPiece.classList.add(currColor);
                createPiece.classList.add(currPiece);
                createPiece.style = `background-image: url(./images/${currColor}_${currPiece}.png)`;
                createPiece.addEventListener("dragstart", function(e){
                    selectedPiece = e.target;
                });
                createPiece.addEventListener("click", function(e){
                    selectedPiece = e.target;
                });
                createPiece.addEventListener("click", rules[`${currPiece}_rule`]);
                createPiece.addEventListener("dragstart", rules[`${currPiece}_rule`]);
                div.appendChild(createPiece);
            }
            let board = document.getElementById("board");
            board.appendChild(div);
        }
        alt *= -1
    }
    const squares = document.querySelectorAll(".squares");
    squares.forEach((square) => {
        square.addEventListener("dragover", (e) => {
            e.preventDefault();
        });
        square.addEventListener("drop", (e) => {
            if (square.lastChild.className == "greyCircle") square.appendChild(selectedPiece);
            selectedPiece = null;
            removeGreyCircle();
        });
        square.addEventListener("click", (e) => {
            if (square.lastChild.className == "greyCircle")
            {
                square.appendChild(selectedPiece);
                selectedPiece = null;
                removeGreyCircle();
            }
        });
    });
}
load()