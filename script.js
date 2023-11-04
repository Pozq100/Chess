const pieces = [
  "rook",
  "knight",
  "bishop",
  "queen",
  "king",
  "bishop",
  "knight",
  "rook",
];
let selectedPiece;
var currTurn = "white";
let greyCircle = createGreyCircle();

function globalGreyCheck(checkSquare, currColor) {
  greyCircle = createGreyCircle();
  checkSquare.appendChild(greyCircle);
}

const rules = {
  find_curr: function (piece) {
    const parentID = piece.parentNode.id;
    const currRow = parseInt(parentID[0]);
    const currCol = parseInt(parentID[1]);
    const currColor = Array.from(piece.classList)[1];
    return { currRow, currCol, currColor };
  },
  rook_rule: function () {
    const { currRow, currCol, currColor } = rules["find_curr"](this);
    if (currTurn != currColor) {
      return;
    }
    removeGreyCircle();
    selectedPiece = this;
    // up is currRow - 1, down is currRow + 1, left is currCol - 1, right is currCol + 1
    function create(index, UpDown, iterate) {
      let toStay = "col";
      if (UpDown) toStay = "row";
      while (true) {
        index += iterate;
        let checkSquare;
        if (toStay == "row")
          checkSquare = document.getElementById(`${index}${currCol}`);
        else checkSquare = document.getElementById(`${currRow}${index}`);
        if (index < 0 || index > 7) break;
        // make capturable piece
        if (checkSquare.hasChildNodes()) {
          capturable(currColor, checkSquare);
          break;
        }
        // make a grey circle in the square
        globalGreyCheck(checkSquare, currColor);
      }
    }
    // up
    create(currRow, true, -1);
    // down
    create(currRow, true, 1);
    // right
    create(currCol, false, 1);
    //left
    create(currCol, false, -1);
  },

  knight_rule: function () {
    const { currRow, currCol, currColor } = rules["find_curr"](this);
    if (currTurn != currColor) {
      return;
    }
    removeGreyCircle();
    selectedPiece = this;
    // i - 2: j - 1, j + 1
    // i - 1: j - 2, j + 2
    // i + 1: j - 2, j + 2
    // i + 2: j - 1, j + 1
    function create(row, iterateCol) {
      if (row < 0 || row > 7) return;
      let j1 = currCol - iterateCol;
      let j2 = currCol + iterateCol;
      let checkSquare;
      let greyCircle;
      checkSquare = document.getElementById(`${row}${j1}`);
      if (checkSquare && checkSquare.hasChildNodes()) {
        capturable(currColor, checkSquare);
      }
      if (j1 >= 0 && !checkSquare.hasChildNodes()) {
        globalGreyCheck(checkSquare, currColor);
      }
      checkSquare = document.getElementById(`${row}${j2}`);
      if (checkSquare && checkSquare.hasChildNodes()) {
        capturable(currColor, checkSquare);
      }
      if (j2 < 8 && !checkSquare.hasChildNodes()) {
        globalGreyCheck(checkSquare, currColor);
      }
    }

    create(currRow - 2, 1);
    create(currRow - 1, 2);
    create(currRow + 2, 1);
    create(currRow + 1, 2);
  },

  bishop_rule: function () {
    const { currRow, currCol, currColor } = rules["find_curr"](this);
    if (currTurn != currColor) {
      return;
    }
    removeGreyCircle();
    selectedPiece = this;
    // i + 1, j - 1
    // i + 1, j + 1
    // i - 1, j - 1
    // i - 1, j + 1
    function create(row, col, iterateRow, iterateCol) {
      while (true) {
        row += iterateRow;
        col += iterateCol;
        checkSquare = document.getElementById(`${row}${col}`);
        if (row < 0 || row > 7 || col < 0 || col > 7) break;
        if (checkSquare.hasChildNodes()) {
          capturable(currColor, checkSquare);
          break;
        }
        globalGreyCheck(checkSquare, currColor);
      }
    }

    create(currRow, currCol, 1, -1);
    create(currRow, currCol, 1, 1);
    create(currRow, currCol, -1, -1);
    create(currRow, currCol, -1, 1);
  },

  queen_rule: function () {
    const { currRow, currCol, currColor } = rules["find_curr"](this);
    if (currTurn != currColor) {
      return;
    }
    removeGreyCircle();
    selectedPiece = this;

    function createDiag(row, col, iterateRow, iterateCol) {
      while (true) {
        row += iterateRow;
        col += iterateCol;
        checkSquare = document.getElementById(`${row}${col}`);
        if (row < 0 || row > 7 || col < 0 || col > 7) break;
        if (checkSquare.hasChildNodes()) {
          capturable(currColor, checkSquare);
          break;
        }
        globalGreyCheck(checkSquare, currColor);
      }
    }

    createDiag(currRow, currCol, 1, -1);
    createDiag(currRow, currCol, 1, 1);
    createDiag(currRow, currCol, -1, -1);
    createDiag(currRow, currCol, -1, 1);

    function createLine(index, UpDown, iterate) {
      let toStay = "col";
      if (UpDown) toStay = "row";
      while (true) {
        index += iterate;
        let checkSquare;
        if (toStay == "row")
          checkSquare = document.getElementById(`${index}${currCol}`);
        else checkSquare = document.getElementById(`${currRow}${index}`);
        if (index < 0 || index > 7) break;
        if (checkSquare.hasChildNodes()) {
          capturable(currColor, checkSquare);
          break;
        }
        // make a grey circle in the square
        globalGreyCheck(checkSquare, currColor);
      }
    }
    // up
    createLine(currRow, true, -1);
    // down
    createLine(currRow, true, 1);
    // right
    createLine(currCol, false, 1);
    //left
    createLine(currCol, false, -1);
  },

  king_rule: function () {
    const { currRow, currCol, currColor } = rules["find_curr"](this);
    if (currTurn != currColor) {
      return;
    }
    removeGreyCircle();
    selectedPiece = this;

    let topleftRow = currRow - 1;
    let topleftCol = currCol - 1;
    for (let i = 0; i < 3; i++) {
      let row = topleftRow + i;
      if (row >= 0 && row < 8) {
        for (let j = 0; j < 3; j++) {
          let col = topleftCol + j;
          if (col >= 0 && col < 8) {
            let checkSquare = document.getElementById(`${row}${col}`);
            if (!checkSquare.hasChildNodes()) {
              if (!incheck(this,[row,col])) globalGreyCheck(checkSquare, currColor);
            } else {
              if (!incheck(this,[row,col])) capturable(currColor, checkSquare);
            }
          }
        }
      }
    }
  },

  pawn_rule: function () {
    const { currRow, currCol, currColor } = rules["find_curr"](this);
    if (currTurn != currColor) {
      return;
    }
    removeGreyCircle();

    // at the start its able to move 2 squares or 1 squares
    if (currColor == "white") {
      let checkSquare = document.getElementById(`${currRow - 1}${currCol}`);
      if (!checkSquare.hasChildNodes()) {
        globalGreyCheck(checkSquare, currColor);
      }
      checkSquare = document.getElementById(`${currRow - 2}${currCol}`);
      if (currRow == 6 && !checkSquare.hasChildNodes()) {
        globalGreyCheck(checkSquare, currColor);
      }
      checkSquare = document.getElementById(`${currRow - 1}${currCol - 1}`);
      if (checkSquare && checkSquare.hasChildNodes())
        capturable(currColor, checkSquare);
      checkSquare = document.getElementById(`${currRow - 1}${currCol + 1}`);
      if (checkSquare && checkSquare.hasChildNodes())
        capturable(currColor, checkSquare);
    } else {
      let checkSquare = document.getElementById(`${currRow + 1}${currCol}`);
      if (!checkSquare.hasChildNodes()) {
        globalGreyCheck(checkSquare, currColor);
      }
      checkSquare = document.getElementById(`${currRow + 2}${currCol}`);
      if (currRow == 1 && !checkSquare.hasChildNodes()) {
        globalGreyCheck(checkSquare, currColor);
      }
      checkSquare = document.getElementById(`${currRow + 1}${currCol - 1}`);
      if (checkSquare && checkSquare.hasChildNodes())
        capturable(currColor, checkSquare);
      checkSquare = document.getElementById(`${currRow + 1}${currCol + 1}`);
      if (checkSquare && checkSquare.hasChildNodes())
        capturable(currColor, checkSquare);
    }
    selectedPiece = this;
  },
};

function capturable(currPieceColor, parentofOther) {
  const otherPiece = parentofOther.children[0];
  const otherPieceColor = Array.from(otherPiece.classList)[1];
  if (otherPieceColor != currPieceColor) {
    parentofOther.classList.add("capturable");
  }
}

function createGreyCircle() {
  let div = document.createElement("div");
  div.className = "greyCircle";
  return div;
}

function removeGreyCircle() {
  let circles = document.querySelectorAll(".greyCircle");
  circles.forEach(function (element) {
    element.remove();
  });
  const capturableElements = document.querySelectorAll(".capturable");
  capturableElements.forEach((element) => {
    element.classList.remove("capturable");
  });
}

function HandleTurnChange() {
  // make it so that only the pieces of the same color as currTurn can be dragged
  const dragpieces = document.querySelectorAll(`.${currTurn}`);
  dragpieces.forEach( function(element){
    element.draggable = true;
  });
  let prevTurn;
  if (currTurn == "white") prevTurn = "black";
  else prevTurn = "white"
  const nondragpieces = document.querySelectorAll(`.${prevTurn}`);
  nondragpieces.forEach( function(element){
    element.draggable = false;
  });

  // check if the curr king is in check
  const currKing = document.getElementsByClassName(`piece ${currTurn} king`);
  if (incheck(currKing[0])) currKing[0].parentNode.classList.add("incheck");
  else {
    let toRemove = document.querySelectorAll(".incheck");
    toRemove.forEach(function(element) {
      element.classList.remove("incheck");
    });
  }
}

function incheck(currKing,currPosition) {
  let { currRow, currCol, currColor } = rules["find_curr"](currKing);
  if (currPosition) {
    currRow = currPosition[0];
    currCol = currPosition[1];
  }
  console.log(currRow,currCol,currColor);
  // check the rows
  function checkChild(pieceType,checkSquare) {
    let child = checkSquare.children[0];
    let childColor = Array.from(child.classList)[1];
    if (childColor != currColor) {
      childType = Array.from(child.classList)[2];
      if (pieceType.includes(childType)){
        return true;
      }
    }
    return false
  }
  function checkLine(index, UpDown, iterate) {
    let toStay = "col";
    if (UpDown) toStay = "row";
    while (true) {
      index += iterate;
      let checkSquare;
      if (toStay == "row")
        checkSquare = document.getElementById(`${index}${currCol}`);
      else checkSquare = document.getElementById(`${currRow}${index}`);
      if (index < 0 || index > 7) break;
      if (checkSquare.hasChildNodes()) {
        if (checkChild(["rook","queen"],checkSquare)) return true;
        break;
      }
    }
    return false;
  }
  if (checkLine(currRow, true, -1) ||
  checkLine(currRow, true, 1) ||
  checkLine(currCol, false, 1) ||
  checkLine(currCol, false, -1)) return true;
  // check the diags
  function checkDiag(row, col, iterateRow, iterateCol) {
    while (true) {
      row += iterateRow;
      col += iterateCol;
      checkSquare = document.getElementById(`${row}${col}`);
      if (row < 0 || row > 7 || col < 0 || col > 7) break;
      if (checkSquare.hasChildNodes()) {
        //check the color
        if (checkChild(["bishop","queen"],checkSquare)) return true;
        break;
      }
    }
    return false;
  }

  if (checkDiag(currRow, currCol, 1, -1) ||
  checkDiag(currRow, currCol, 1, 1) ||
  checkDiag(currRow, currCol, -1, -1) ||
  checkDiag(currRow, currCol, -1, 1)) return true;

  //check knights
  function  checkKnight(row, iterateCol) {
    if (row < 0 || row > 7) return false;
    let j1 = currCol - iterateCol;
    let j2 = currCol + iterateCol;
    let checkSquare;
    checkSquare = document.getElementById(`${row}${j1}`);
    if (checkSquare && checkSquare.hasChildNodes()) {
      if (checkChild(["knight"],checkSquare)) return true
    }
    checkSquare = document.getElementById(`${row}${j2}`);
    if (checkSquare && checkSquare.hasChildNodes()) {
      if (checkChild(["knight"],checkSquare)) return true
    }
    return false;
  }

  if (checkKnight(currRow - 2, 1) ||
  checkKnight(currRow - 1, 2) ||
  checkKnight(currRow + 2, 1) ||
  checkKnight(currRow + 1, 2)) return true;

  // check if in check with a pawn

  if (currColor == "black") {
    checkSquare = document.getElementById(`${currRow+1}${currCol-1}`);
    if (checkSquare && checkSquare.hasChildNodes()) {
      if (checkChild(["pawn"],checkSquare)) return true
    }
    checkSquare = document.getElementById(`${currRow+1}${currCol+1}`);
    if (checkSquare && checkSquare.hasChildNodes()) {
      if (checkChild(["pawn"],checkSquare)) return true
    }
  } else {
    checkSquare = document.getElementById(`${currRow-1}${currCol-1}`);
    if (checkSquare && checkSquare.hasChildNodes()) {
      if (checkChild(["pawn"],checkSquare)) return true
    }
    checkSquare = document.getElementById(`${currRow-1}${currCol+1}`);
    if (checkSquare && checkSquare.hasChildNodes()) {
      if (checkChild(["pawn"],checkSquare)) return true
    }
  }

  return false;
}

function load() {
  let alt = -1;
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
        if (i == 0 || i == 1) {
          currColor = "black";
        } else {
          currColor = "white";
        }
        if (i == 1 || i == 6) {
          currPiece = "pawn";
        } else {
          currPiece = pieces[j];
        }
        createPiece.className = "piece";
        createPiece.draggable = true;
        createPiece.classList.add(currColor);
        createPiece.classList.add(currPiece);
        createPiece.style = `background-image: url(./images/${currColor}_${currPiece}.png)`;
        createPiece.addEventListener("click", rules[`${currPiece}_rule`]);
        createPiece.addEventListener("dragstart", rules[`${currPiece}_rule`]);
        div.appendChild(createPiece);
      }
      let board = document.getElementById("board");
      board.appendChild(div);
    }
    alt *= -1;
  }
  const squares = document.querySelectorAll(".squares");
  squares.forEach((square) => {
    square.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    square.addEventListener("drop", (e) => {
      if (square.classList.contains("capturable")) {
        let child = square.children[0];
        square.removeChild(child);
        square.appendChild(selectedPiece);
        if (currTurn == "white") currTurn = "black";
        else if (currTurn == "black") currTurn = "white";
      }
      if (square.lastChild.className == "greyCircle") {
        square.appendChild(selectedPiece);
        if (currTurn == "white") currTurn = "black";
        else if (currTurn == "black") currTurn = "white";
      }
      removeGreyCircle();
      HandleTurnChange();
      selectedPiece = null;
      removeGreyCircle();
    });
    square.addEventListener("click", (e) => {
      if (square.classList.contains("capturable")) {
        let child = square.children[0];
        square.removeChild(child);
        square.appendChild(selectedPiece);
        removeGreyCircle();
        if (currTurn == "white") currTurn = "black";
        else if (currTurn == "black") currTurn = "white";
        HandleTurnChange();
        selectedPiece = null;
      }
      if (square.lastChild.className == "greyCircle") {
        square.appendChild(selectedPiece);
        if (currTurn == "white") currTurn = "black";
        else if (currTurn == "black") currTurn = "white";
        removeGreyCircle();
        HandleTurnChange();
        selectedPiece = null;
      }
    });
  });
}


function checkTurn() {
  console.log(currTurn);
}
load();
