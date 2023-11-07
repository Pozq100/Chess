// what else is missig
// en passant
// pawn promotion
// castling

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

const promotePiece = ["rook", "knight", "bishop", "queen"];

let selectedPiece;
var currTurn = "white";
let greyCircle = createGreyCircle();

function globalGreyCheck(checkSquare, currColor, check) {
  const currKing = document.getElementsByClassName(`piece ${currTurn} king`);
  const parentID = checkSquare.id;
  const currRow = parseInt(parentID[0]);
  const currCol = parseInt(parentID[1]);
  if (incheck(currKing[0], null, [currRow, currCol])) {
    return;
  }
  if (check) return true;
  greyCircle = createGreyCircle();
  checkSquare.appendChild(greyCircle);
}

function capturable(currPieceColor, parentofOther, check) {
  const otherPiece = parentofOther.children[0];
  const otherPieceColor = Array.from(otherPiece.classList)[1];
  const currKing = document.getElementsByClassName(`piece ${currTurn} king`);
  const parentID = parentofOther.id;
  const currRow = parseInt(parentID[0]);
  const currCol = parseInt(parentID[1]);
  if (incheck(currKing[0], null, [currRow, currCol])) {
    return;
  }
  if (check) return true;
  if (otherPieceColor != currPieceColor) {
    parentofOther.classList.add("capturable");
  }
}

const rules = {
  find_curr: function (piece) {
    const parentID = piece.parentNode.id;
    const currRow = parseInt(parentID[0]);
    const currCol = parseInt(parentID[1]);
    const currColor = Array.from(piece.classList)[1];
    return { currRow, currCol, currColor };
  },
  rook_rule: function (element, check) {
    if (!check) {
      element = this;
    }
    const { currRow, currCol, currColor } = rules["find_curr"](element);
    if (currTurn != currColor) {
      return;
    }
    removeGreyCircle();
    selectedPiece = element;
    // up is currRow - 1, down is currRow + 1, left is currCol - 1, right is currCol + 1
    function create(index, UpDown, iterate) {
      while (true) {
        index += iterate;
        let checkSquare;
        if (UpDown) checkSquare = document.getElementById(`${index}${currCol}`);
        else checkSquare = document.getElementById(`${currRow}${index}`);
        if (index < 0 || index > 7) break;
        // make capturable piece
        if (checkSquare.hasChildNodes()) {
          if (capturable(currColor, checkSquare, check)) return true;
          break;
        }
        // make a grey circle in the square
        if (globalGreyCheck(checkSquare, currColor, check)) return true;
      }
    }
    create(currRow, true, -1);
    create(currRow, true, 1);
    create(currCol, false, 1);
    create(currCol, false, -1);
  },

  knight_rule: function (element, check) {
    if (!check) {
      element = this;
    }
    const { currRow, currCol, currColor } = rules["find_curr"](element);
    if (currTurn != currColor) {
      return;
    }
    removeGreyCircle();
    selectedPiece = element;
    // i - 2: j - 1, j + 1
    // i - 1: j - 2, j + 2
    // i + 1: j - 2, j + 2
    // i + 2: j - 1, j + 1
    function create(row, iterateCol) {
      if (row < 0 || row > 7) return;
      let j1 = currCol - iterateCol;
      let j2 = currCol + iterateCol;
      let checkSquare;
      checkSquare = document.getElementById(`${row}${j1}`);
      if (checkSquare && checkSquare.hasChildNodes()) {
        if (capturable(currColor, checkSquare, check)) return true;
      }
      if (j1 >= 0 && !checkSquare.hasChildNodes()) {
        if (globalGreyCheck(checkSquare, currColor, check)) return true;
      }
      checkSquare = document.getElementById(`${row}${j2}`);
      if (checkSquare && checkSquare.hasChildNodes()) {
        if (capturable(currColor, checkSquare, check)) return true;
      }
      if (j2 < 8 && !checkSquare.hasChildNodes()) {
        if (globalGreyCheck(checkSquare, currColor, check)) return true;
      }
    }

    if (
      create(currRow - 2, 1) ||
      create(currRow - 1, 2) ||
      create(currRow + 2, 1) ||
      create(currRow + 1, 2)
    )
      return true;
  },

  bishop_rule: function (element, check) {
    if (!check) {
      element = this;
    }
    const { currRow, currCol, currColor } = rules["find_curr"](element);
    if (currTurn != currColor) {
      return;
    }
    removeGreyCircle();
    selectedPiece = element;
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
          if (capturable(currColor, checkSquare, check)) return true;
          break;
        }
        if (globalGreyCheck(checkSquare, currColor, check)) return true;
      }
    }

    if (
      create(currRow, currCol, 1, -1) ||
      create(currRow, currCol, 1, 1) ||
      create(currRow, currCol, -1, -1) ||
      create(currRow, currCol, -1, 1)
    )
      return true;
  },

  queen_rule: function (element, check) {
    if (!check) {
      element = this;
    }
    const { currRow, currCol, currColor } = rules["find_curr"](element);
    if (currTurn != currColor) {
      return;
    }
    removeGreyCircle();
    selectedPiece = element;

    function createDiag(row, col, iterateRow, iterateCol) {
      while (true) {
        row += iterateRow;
        col += iterateCol;
        checkSquare = document.getElementById(`${row}${col}`);
        if (row < 0 || row > 7 || col < 0 || col > 7) break;
        if (checkSquare.hasChildNodes()) {
          if (capturable(currColor, checkSquare, check)) return true;
          break;
        }
        if (globalGreyCheck(checkSquare, currColor, check)) return true;
      }
    }

    if (
      createDiag(currRow, currCol, 1, -1) ||
      createDiag(currRow, currCol, 1, 1) ||
      createDiag(currRow, currCol, -1, -1) ||
      createDiag(currRow, currCol, -1, 1)
    )
      return true;
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
          if (capturable(currColor, checkSquare, check)) return true;
          break;
        }
        // make a grey circle in the square
        if (globalGreyCheck(checkSquare, currColor, check)) return true;
      }
    }
    if (
      createLine(currRow, true, -1) ||
      createLine(currRow, true, 1) ||
      createLine(currCol, false, 1) ||
      createLine(currCol, false, -1)
    )
      return true;
  },

  king_rule: function (element, check) {
    if (!check) {
      element = this;
    }
    const { currRow, currCol, currColor } = rules["find_curr"](element);
    if (currTurn != currColor) {
      return;
    }
    removeGreyCircle();
    selectedPiece = element;

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
              if (!incheck(element, [row, col])) {
                if (check) return true;
                greyCircle = createGreyCircle();
                checkSquare.appendChild(greyCircle);
              }
            } else {
              if (!incheck(element, [row, col])) {
                if (capturable(currColor, checkSquare, check)) return true;
              }
            }
          }
        }
      }
    }
  },

  pawn_rule: function (element, check) {
    if (!check) {
      element = this;
    }
    const { currRow, currCol, currColor } = rules["find_curr"](element);
    if (currTurn != currColor) {
      return;
    }
    removeGreyCircle();
    selectedPiece = element;
    // at the start its able to move 2 squares or 1 squares
    if (currColor == "white") {
      let checkSquare = document.getElementById(`${currRow - 1}${currCol}`);
      if (!checkSquare.hasChildNodes()) {
        if (globalGreyCheck(checkSquare, currColor, check)) return true;
        checkSquare = document.getElementById(`${currRow - 2}${currCol}`);
        if (currRow == 6 && !checkSquare.hasChildNodes()) {
          if (globalGreyCheck(checkSquare, currColor, check)) return true;
        }
      }
      checkSquare = document.getElementById(`${currRow - 1}${currCol - 1}`);
      if (checkSquare && checkSquare.hasChildNodes())
        if (capturable(currColor, checkSquare, check)) return true;
      checkSquare = document.getElementById(`${currRow - 1}${currCol + 1}`);
      if (checkSquare && checkSquare.hasChildNodes())
        if (capturable(currColor, checkSquare, check)) return true;
    } else {
      let checkSquare = document.getElementById(`${currRow + 1}${currCol}`);
      if (!checkSquare.hasChildNodes()) {
        if (globalGreyCheck(checkSquare, currColor, check)) return true;
        checkSquare = document.getElementById(`${currRow + 2}${currCol}`);
        if (currRow == 1 && !checkSquare.hasChildNodes()) {
          if (globalGreyCheck(checkSquare, currColor, check)) return true;
        }
      }
      checkSquare = document.getElementById(`${currRow + 1}${currCol - 1}`);
      if (checkSquare && checkSquare.hasChildNodes())
        if (capturable(currColor, checkSquare, check)) return true;
      checkSquare = document.getElementById(`${currRow + 1}${currCol + 1}`);
      if (checkSquare && checkSquare.hasChildNodes())
        if (capturable(currColor, checkSquare, check)) return true;
    }
  },
};

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
  // check for pawn promotion
  let pieceType = Array.from(selectedPiece.classList)[2];
  let pieceColor = Array.from(selectedPiece.classList)[1];
  let pieceRow = parseInt(selectedPiece.parentNode.id[0]);
  let pieceID = selectedPiece.parentNode;
  if (pieceType == "pawn" && pieceColor == "white" && pieceRow == 0) {
    console.log("promote white");
    promotion(pieceColor, pieceID);
  } else if (pieceType == "pawn" && pieceColor == "black" && pieceRow == 7) {
    console.log("promote black");
    promotion(pieceColor, pieceID);
  }

  // make it so that only the pieces of the same color as currTurn can be dragged
  const dragpieces = document.querySelectorAll(`.${currTurn}`);
  dragpieces.forEach(function (element) {
    element.draggable = true;
  });
  let prevTurn;
  if (currTurn == "white") prevTurn = "black";
  else prevTurn = "white";
  const nondragpieces = document.querySelectorAll(`.${prevTurn}`);
  nondragpieces.forEach(function (element) {
    element.draggable = false;
  });
  selectedPiece = null;

  // check if the curr king is in check
  const currKing = document.getElementsByClassName(`piece ${currTurn} king`);
  if (incheck(currKing[0])) {
    currKing[0].parentNode.classList.add("incheck");
    if (checkmate()) {
      // Game ended
      console.log("checkmateeeeaeeeeeeeeeeeeeeeeeee");
      handleEndGame(prevTurn);
    }
  } else {
    let toRemove = document.querySelectorAll(".incheck");
    toRemove.forEach(function (element) {
      element.classList.remove("incheck");
    });
  }
}

function incheck(currKing, currPosition, blockCheck) {
  let { currRow, currCol, currColor } = rules["find_curr"](currKing);
  if (currPosition) {
    currRow = currPosition[0];
    currCol = currPosition[1];
  }
  let blockCheckRow;
  let blockCheckCol;
  if (blockCheck) {
    blockCheckRow = blockCheck[0];
    blockCheckCol = blockCheck[1];
  }
  function checkChild(pieceType, checkSquare) {
    let child = checkSquare.children[0];
    let childColor = Array.from(child.classList)[1];
    if (childColor != currColor) {
      childType = Array.from(child.classList)[2];
      if (pieceType.includes(childType)) {
        return true;
      }
    }
    return false;
  }
  // check the rows
  function checkLine(index, UpDown, iterate) {
    while (true) {
      index += iterate;
      let checkSquare;
      if (UpDown) checkSquare = document.getElementById(`${index}${currCol}`);
      else checkSquare = document.getElementById(`${currRow}${index}`);
      if (index < 0 || index > 7) break;
      if (blockCheck) {
        if (UpDown && index == blockCheckRow && currCol == blockCheckCol) break;
        else if (!UpDown && index == blockCheckCol && currRow == blockCheckRow)
          break;
      }
      if (
        checkSquare.hasChildNodes() &&
        !checkSquare.children[0].classList.contains("greyCircle") &&
        selectedPiece != checkSquare.children[0]
      ) {
        if (checkChild(["rook", "queen"], checkSquare)) return true;
        break;
      }
    }
  }
  if (
    checkLine(currRow, true, -1) ||
    checkLine(currRow, true, 1) ||
    checkLine(currCol, false, 1) ||
    checkLine(currCol, false, -1)
  )
    return true;
  // check the diags
  function checkDiag(row, col, iterateRow, iterateCol) {
    while (true) {
      row += iterateRow;
      col += iterateCol;
      checkSquare = document.getElementById(`${row}${col}`);
      if (row < 0 || row > 7 || col < 0 || col > 7) break;
      if (blockCheck && blockCheckRow == row && blockCheckCol == col) break;
      if (
        checkSquare.hasChildNodes() &&
        !checkSquare.children[0].classList.contains("greyCircle") &&
        selectedPiece != checkSquare.children[0]
      ) {
        //check the color
        if (checkChild(["bishop", "queen"], checkSquare)) return true;
        break;
      }
    }
  }

  if (
    checkDiag(currRow, currCol, 1, -1) ||
    checkDiag(currRow, currCol, 1, 1) ||
    checkDiag(currRow, currCol, -1, -1) ||
    checkDiag(currRow, currCol, -1, 1)
  )
    return true;
  //check knights
  function checkKnight(row, iterateCol) {
    if (row < 0 || row > 7) return false;
    let j1 = currCol - iterateCol;
    let j2 = currCol + iterateCol;
    let checkSquare;
    checkSquare = document.getElementById(`${row}${j1}`);
    if (
      checkSquare &&
      checkSquare.hasChildNodes() &&
      !checkSquare.children[0].classList.contains("greyCircle") &&
      selectedPiece != checkSquare.children[0]
    ) {
        if (checkChild(["knight"], checkSquare)) return true;
    }
    checkSquare = document.getElementById(`${row}${j2}`);
    if (
      checkSquare &&
      checkSquare.hasChildNodes() &&
      !checkSquare.children[0].classList.contains("greyCircle") &&
      selectedPiece != checkSquare.children[0]
    ) {
        if (checkChild(["knight"], checkSquare)) return true;
    }
  }

  if (
    checkKnight(currRow - 2, 1) ||
    checkKnight(currRow - 1, 2) ||
    checkKnight(currRow + 2, 1) ||
    checkKnight(currRow + 1, 2)
  )
    return true;

  // check if in check with a pawn

  if (currColor == "black") {
    checkSquare = document.getElementById(`${currRow + 1}${currCol - 1}`);
    if (
      checkSquare &&
      checkSquare.hasChildNodes() &&
      !checkSquare.children[0].classList.contains("greyCircle") &&
      selectedPiece != checkSquare.children[0]
    ) {
        if (checkChild(["pawn"], checkSquare)) return true;
    }
    checkSquare = document.getElementById(`${currRow + 1}${currCol + 1}`);
    if (
      checkSquare &&
      checkSquare.hasChildNodes() &&
      !checkSquare.children[0].classList.contains("greyCircle") &&
      selectedPiece != checkSquare.children[0]
    ) {
        if (checkChild(["pawn"], checkSquare)) return true;
    }
  } else {
    checkSquare = document.getElementById(`${currRow - 1}${currCol - 1}`);
    if (
      checkSquare &&
      checkSquare.hasChildNodes() &&
      !checkSquare.children[0].classList.contains("greyCircle") &&
      selectedPiece != checkSquare.children[0]
    ) {
      if (checkChild(["pawn"], checkSquare)) return true;
    }
    checkSquare = document.getElementById(`${currRow - 1}${currCol + 1}`);
    if (
      checkSquare &&
      checkSquare.hasChildNodes() &&
      !checkSquare.children[0].classList.contains("greyCircle") &&
      selectedPiece != checkSquare.children[0]
    ) {
      if (checkChild(["pawn"], checkSquare)) return true;
    }
  }

  return false;
}
function checkmate() {
  const allyPieces = document.querySelectorAll(`.${currTurn}`);
  let check = true;
  allyPieces.forEach((eachPiece) => {
    let pieceType = Array.from(eachPiece.classList)[2];
    if (rules[`${pieceType}_rule`](eachPiece, true)) {
      check = false;
    }
  });
  return check;
}

function handleEndGame(prevTurn) {
  let board = document.getElementById("board");
  let div = document.createElement("div");
  div.id = "gameover";
  div.textContent = `${prevTurn} Won!!!!`;
  let divButton = document.createElement("button");
  divButton.id = "refreshButton";
  div.onclick = function () {
    refresh();
  };
  div.appendChild(divButton);
  board.appendChild(div);
}

function refresh() {
  const board = document.getElementById("board");
  while (board.hasChildNodes()) {
    board.removeChild(board.firstChild);
  }
  load();
}

function promotion(color, ID) {
  let board = document.getElementById("board");
  let div = document.createElement("div");
  div.id = "promotion";
  board.appendChild(div);
  console.log(color);
  for (let i = 0; i < 4; i++) {
    let createDiv = document.createElement("div");
    let currPiece = promotePiece[i];
    createDiv.className = "piece";
    createDiv.classList.add(color);
    createDiv.classList.add(currPiece);
    createDiv.style = `background-image: url(./images/${color}_${currPiece}.png)`;
    createDiv.onclick = function () {
      promote(ID, currPiece, color);
    };
    div.appendChild(createDiv);
  }
}

function promote(square, piece, color) {
  const newPiece = document.createElement("div");
  newPiece.className = "piece";
  newPiece.classList.add(color);
  newPiece.classList.add(piece);
  newPiece.style = `background-image: url(./images/${color}_${piece}.png)`;
  newPiece.addEventListener("click", rules[`${piece}_rule`]);
  newPiece.addEventListener("dragstart", rules[`${piece}_rule`]);
  square.removeChild(square.lastChild);
  square.appendChild(newPiece);
  document.getElementById("promotion").remove();
  const currKing = document.getElementsByClassName(`piece ${currTurn} king`);
  if (incheck(currKing[0])) {
    currKing[0].parentNode.classList.add("incheck");
  }
}

function load() {
  currTurn = "white";
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
      }
      if (square.lastChild.className == "greyCircle") {
        square.appendChild(selectedPiece);
        if (currTurn == "white") currTurn = "black";
        else if (currTurn == "black") currTurn = "white";
        removeGreyCircle();
        HandleTurnChange();
      }
    });
  });
}

function checkTurn() {
  console.log(currTurn);
}
load();
