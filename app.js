const attackOne = document.querySelector(".attack1");
const attackTwo = document.querySelector(".attack2");
const attackThree = document.querySelector(".attack3");
const attackFour = document.querySelector(".attack4");
const playerTwoHealthBar = document.querySelector(".p2-health");
const playerTwoHealthCount = document.querySelector(".health-count-p2");
const playerOneHealthBar = document.querySelector(".p1-health");
const playerOneHealthCount = document.querySelector(".health-count-p1");
const gameStateText = document.querySelector(".game-state");
const attackContainer = document.querySelector(".attack-container");
const restartBtn = document.querySelector(".restart-game");
let playerOneHealth;
let playerTwoHealth;
let Health1;
let Health2;


var playerOneAttacks=[];
var playerTwoAttacks = [];

var pokemon1=sessionStorage.getItem("pokemon1");
var pokemon2=sessionStorage.getItem("pokemon2");
setupDuel();

function setupDuel(){
  document.querySelector("#poke2").innerHTML=pokemon2;
  document.querySelector("#poke1").innerHTML=pokemon1;

  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon1}`)
  .then((response) => response.json())
  .then((data) => {
    playerOneHealth = data.stats[0].base_stat;
    Health1 = data.stats[0].base_stat;
    document.querySelector("#poke1_img").setAttribute("src",data.sprites.other["official-artwork"].front_default);
    for(var i =1; i<5;i++){
      document.querySelector(".attack"+i).innerHTML=data.moves[i-1].move.name;
      playerOneAttacks.push(data.moves[i-1].move.name);
    }
    
  })
  .catch((err) => {
    console.log("Error", err);
  });

  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon2}`)
  .then((response) => response.json())
  .then((data) => {
    playerTwoHealth = data.stats[0].base_stat;
    Health2 = data.stats[0].base_stat;
    document.querySelector("#poke2_img").setAttribute("src",data.sprites.other["official-artwork"].front_default);
    for(var i =1; i<5;i++){
    playerTwoAttacks.push(data.moves[i-1].move.name);
    }
  })
  .catch((err) => {
    console.log("Pokemon not found", err);
  });
  
  
}

// Changes health colour for player one and player two
const healthColor = (playerHealth, playerBar) => {
  if (playerHealth < 40 && playerHealth > 20) {
    playerBar.style.backgroundColor = "#cee809";
  } else if (playerHealth < 20) {
    playerBar.style.backgroundColor = "red";
  } else {
    playerBar.style.backgroundColor = "green";
  }
};

// Checks which player wins
const checkWinner = (name, playerBar, playerCount) => {
  gameStateText.innerText = `${name} wins! Press restart to play again!`;
  playerBar.style.width = "0%";
  gameStateText.style.display = "block";
  attackContainer.style.display = "none";
  if(name==pokemon1){
    playerCount.innerText = `0 / ${playerTwoHealth}`;
  }
  else {
    playerCount.innerText = `0 / ${playerOneHealth}`;
  }
  
  restartBtn.style.display = "block";
};

const playerOneAttack = (subtract, missCount, attackName) => {
  const randomNumber = Math.floor(Math.random() * missCount) + 1;   // random number for the miss
  if (randomNumber !== 1) {
    playerTwoHealth -= subtract;
    if (playerTwoHealth <= 0) {
      checkWinner(pokemon1, playerTwoHealthBar, playerTwoHealthCount);
    } else if (playerOneHealth <= 0) {
      checkWinner(pokemon2, playerOneHealthBar, playerOneHealthCount);
    } else {
      intervalFunction();
      playerTwoHealthBar.style.width = `${playerTwoHealth/Health2*100}%`;
      playerTwoHealthBar.style.transition = "1.4s";
      playerTwoHealthCount.innerText = `${playerTwoHealth}/${Health2}`;
      gameStateText.innerText = `${pokemon1} used ${attackName}! It took away ${subtract} HP!`;
      attackContainer.style.display = "none";
    }
    // Miss game state text
  } else {
    gameStateText.innerText = `${pokemon1} used ${attackName}... But it missed!`;
    intervalFunction();
  }
};

const playerTwoAttack = () => {
  let missCount;
  let subtractHealth;
  const randomAttackNum = Math.floor(Math.random() * 4) + 0;
  const randomAttack = playerTwoAttacks[randomAttackNum];
  console.log(playerTwoAttacks[randomAttackNum],randomAttackNum);
  if (randomAttackNum==0) {
    missCount = 10;
    subtractHealth = 15;
  } else if (randomAttackNum ===1) {
    missCount = 7;
    subtractHealth = 17;
  } else if (randomAttackNum ===2) {
    missCount = 4;
    subtractHealth = 20;
  } else {
    missCount = 2;
    subtractHealth = 32;
  }
  const randomNumber = Math.floor(Math.random() * missCount) + 1;
  if (randomNumber !== 1) {
    playerOneHealth -= subtractHealth;
    if (playerOneHealth <= 0) {
      checkWinner(pokemon2, playerOneHealthBar, playerOneHealthCount);
    } else {
      playerOneHealthBar.style.width = `${playerOneHealth/Health1*100}%`;
      playerOneHealthBar.style.transition = "1.4s";
      playerOneHealthCount.innerText = `${playerOneHealth} / ${Health1}`;
      gameStateText.innerText = `${pokemon2} used ${randomAttack}! It took away ${subtractHealth} HP!`;
      attackContainer.style.display = "none";
    }
  } else {
    gameStateText.innerText = `${pokemon2} used ${randomAttack}... But it missed!`;
  }
  console.log(playerOneHealth,Health1);
};

setInterval(() => {
  healthColor(playerOneHealth, playerOneHealthBar);
}, 500);
const intervalFunction = () => { // Setting interval for the game state auto reading text
  healthColor(playerTwoHealth, playerTwoHealthBar);
  const interval = setInterval(() => {
    gameStateText.style.display = "block";
    attackContainer.style.display = "none";
  }, 1);
  const intervalTwo = setInterval(() => {
    playerTwoAttack();
    clearInterval(intervalTwo);
  }, 2502);
  setTimeout(() => {
    clearInterval(interval);
    if (playerOneHealth >= 0) {
      gameStateText.style.display = "none";
      attackContainer.style.display = "grid";
    }
  }, 5004);
};

// Restart game
const restartGame = () => {
  playerTwoHealthBar.style.width = `100%`;
  gameStateText.style.display = "none";
  attackContainer.style.display = "grid";
  playerOneHealthBar.style.width = `100%`;
  playerOneHealthBar.style.backgroundColor = "green";
  playerTwoHealthBar.style.backgroundColor = "green";
  restartBtn.style.display = "none";
  playerOneHealth = Health1;
  playerTwoHealth = Health2;
};

restartBtn.addEventListener("click", () => restartGame());

// attack event
attackOne.addEventListener("click", () => playerOneAttack(12, 18, playerOneAttacks[0]));
attackTwo.addEventListener("click", () =>
  playerOneAttack(20, 8, playerOneAttacks[1])
);
attackThree.addEventListener("click", () =>
  playerOneAttack(24, 4, playerOneAttacks[2])
);
attackFour.addEventListener("click", () =>
  playerOneAttack(29, 2, playerOneAttacks[3])
);
