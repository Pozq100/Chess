Cards = new Array();
PlayerHand = new Array();
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

function CreateDeck() {
  for (let i = 0; i < CardNum.length; i++) {
    for (let j = 0; j < CardValue.length; j++) {
      let Card_Array_Constructer = `${CardNum[i]}_of_${CardValue[j]}`;
      Cards.push(Card_Array_Constructer);
    }
  }
}

function PlayerAction() {
  // Should be called when player "Pulls from Deck"
  PullFromDeck();
  CheckHandValue();
}

function CheckHandValue() {
  // Should check the total value of the hand of the player interacting
  let Val_of_Card = 0;
  for (let j = 0; j < PlayerHand.length; j++) {
    let CardNum = "";

    for (let i = 0; i < PlayerHand[j].length; i++) {
      if (PlayerHand[j][i] == "_") {
        break;
      }
      CardNum += PlayerHand[j][i];
    }

    if (CardNum == "ace") {
      Val_of_Card += 1;
    } else if (CardNum == "king" || CardNum == "queen" || CardNum == "jack") {
      Val_of_Card += 10;
    } else {
      Val_of_Card += parseInt(CardNum);
    }
  }
  if (Val_of_Card > 21) {
    // Set event for loss
    location.reload();
  }
  console.log(Val_of_Card);
}

function PullFromDeck() {
  // Pull random card, remove from deck, add to player hand
  let RNG = Math.floor(Math.random() * Cards.length);
  let newCard = Cards[RNG];
  Cards.splice(RNG, 1);
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
