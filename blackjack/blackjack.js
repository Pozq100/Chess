const CardNum = [
  "ace",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "king",
  "queen",
  "jack",
];
const CardValue = ["clubs", "diamonds", "hearts", "spades"];
let Cards = [];
let PlayerHand = [];

function CreateDeck() {
  for (let num of CardNum) {
    for (let value of CardValue) {
      Cards.push(`${num}_of_${value}`);
    }
  }
}

function PlayerAction() {
  PullFromDeck();
  CheckHandValue();
}

function CheckHandValue() {
  let Val_of_Card = PlayerHand.reduce((total, card) => {
    let CardNum = card.split("_")[0];
    return (
      total +
      (CardNum === "ace"
        ? 1
        : CardNum === "king" || CardNum === "queen" || CardNum === "jack"
        ? 10
        : parseInt(CardNum))
    );
  }, 0);

  if (Val_of_Card > 21) {
    // Set event for loss
    location.reload();
  }

  console.log(Val_of_Card);
}

function PullFromDeck() {
  let RNG = Math.floor(Math.random() * Cards.length);
  let newCard = Cards.splice(RNG, 1)[0];
  PlayerHand.push(newCard);

  console.log(newCard);
  console.log(PlayerHand);
  console.log(Cards.length);
  console.log("\n");
}

function load() {
  CreateDeck();
}

load();
