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

function PullFromDeck() {
  let RNG = Math.floor(Math.random() * Cards.length);
  let newCard = Cards[RNG];
  Cards.splice(RNG, 1);
  PlayerHand.push(newCard);

  //   let Val_of_Card = 0;
  //   let CardNum = "";
  //   for (let i = 0; i < newCard.length;i++) {
  //     if(newCard[i] == "_") {
  //         break;
  //     }
  //     CardNum += newCard[i];
  //   }

  //   if (CardNum == "ace") {
  //     Val_of_Card = 1;
  //   } else if (CardNum == "king" || CardNum == "queen" || CardNum == "jack") {
  //     Val_of_Card = 10;
  //   } else {
  //     Val_of_Card = parseInt(CardNum);
  //   }
  console.log(newCard);
  console.log(PlayerHand);
  console.log(Cards);
  //   console.log(Val_of_Card);
  console.log("\n");
}

function load() {
  CreateDeck();
}
load();
