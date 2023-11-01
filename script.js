const pieces = ["rook","knight","bishop","queen","king","bishop","knight","rook"];
let selectedPiece;
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
            if (i == 0 || i == 7) {
                let createPiece = document.createElement("div");
                let currColor;
                if (i == 0) {
                    currColor = "black";
                } else {
                    currColor = "white";
                }
                createPiece.className = "piece";
                createPiece.draggable = true;
                createPiece.style = `background-image: url(./images/${currColor}_${pieces[j]}.png)`;
                createPiece.addEventListener("dragstart", function(e){
                    selectedPiece = e.target;
                });
                div.appendChild(createPiece);
            }
            if (i == 1 || i == 6) {
                let createPiece = document.createElement("div");
                let currColor;
                if (i == 1) {
                    currColor = "black";
                } else {
                    currColor = "white";
                }
                createPiece.className = "piece";
                createPiece.draggable = true;
                createPiece.style = `background-image: url(./images/${currColor}_pawn.png)`;
                createPiece.addEventListener("dragstart", function(e){
                    selectedPiece = e.target;
                });
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
            square.classList.add("hovered");
        });
        square.addEventListener("dragleave", () => {
            square.classList.remove("hovered");
        });
        square.addEventListener("drop", (e) => {
            console.log(selectedPiece);
            square.appendChild(selectedPiece);
            selectedPiece = null;
            square.classList.remove("hovered");
        });
    });
}
load()