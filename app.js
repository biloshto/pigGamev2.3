$(function () {
  $('.popup-modal').magnificPopup({
    type: 'inline',
    preloader: false,
    focus: '#username',
    modal: true
  });
  $(document).on('click', '.popup-modal-dismiss', function (e) {
    e.preventDefault();
    $.magnificPopup.close();
  });
});



/*
GAME RULES:

- The game has 2 players, playing in rounds.
- In each turn, a player rolls a dice as many times as he whishes. Each result gets added to his ROUND score.
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn.
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn.
- The first player to reach 100 points on GLOBAL score wins the game.

YOUR 3 CHALLENGES
Change the game to follow these rules:

1. A player looses his ENTIRE score when he rolls two 6 in a row. After that, it's the next player's turn. (Hint: Always save the previous dice roll in a separate variable).
2. Add an input field to the HTML where players can set the winning score, so that they can change the predefined score of 100. (Hint: You can read that value with the .value property in JavaScript. This is a good opportunity to use google to figure this out.)
3. Add another dice to the game, so that there are two dices now. The player looses his current score when one of them is a 1. (Hint: You will need CSS to position the second dice, so take a look at the CSS code for the first one.)

*/

// gamePlaying is a state variable, while it's true the game will be running, when it's false the game will stop
let scores, roundScore, activePlayer, gamePlaying, setFinalScore;


init();


// Roll the dice event listener
// rollDice in this case is a callback function because we don't want to call it here - the event listener method would call it for us; if we put the function call operator () here the function would be immediately called
document.querySelector(".btn-roll").addEventListener("click", rollDice);

function rollDice(e) {
  if(gamePlaying) {
    // Disable the input field
    setFinalScore.disabled = "true";

    // Get random number between 1 and 6 for the dices
    let dice = Math.ceil(Math.random() * 6);
    let anotherDice = Math.ceil(Math.random() * 6);

    // Display the result (show the dices)
    let diceDOM = document.querySelector(".dice");
    diceDOM.style.display = "block";
    diceDOM.src = `img/dice-${dice}.png`;
    let anotherDiceDOM = document.querySelector(".another-dice");
    anotherDiceDOM.style.display = "block";
    anotherDiceDOM.src = `img/dice-${anotherDice}.png`;

    // Update the round score if the rolled number was not a 1
    // same as if we put "#current-" + activePlayer in the brackets 
    
    if(dice !== 1 && anotherDice !== 1) {
      // Add score
      roundScore += dice + anotherDice;
      document.querySelector(`#current-${activePlayer}`).textContent = roundScore;
    } else {
      // Next player
      nextPlayer();
    } 
  }

  e.preventDefault();
}



// Hold result event listener
document.querySelector(".btn-hold").addEventListener("click", holdResult);

function holdResult(e) {
  if(gamePlaying) {
    // Add current score to player's global score
    scores[activePlayer] += roundScore;

    // Update the UI with the score
    document.querySelector(`#score-${activePlayer}`).textContent = scores[activePlayer];

    // Check if player won the game
    if (scores[activePlayer] >= setFinalScore.value) {
      document.querySelector(`#name-${activePlayer}`).textContent = "Winner!";
      document.querySelector(`.dice`).style.display = "none";
      document.querySelector(`.another-dice`).style.display = "none";
      document.querySelector(`.player-${activePlayer}-panel`).classList.add("winner");
      document.querySelector(`.player-${activePlayer}-panel`).classList.remove("active");
      gamePlaying = false;
    } else {
      // Next player
      nextPlayer();
    }
  }

  e.preventDefault();
}

function nextPlayer() {
  // resets the current score to 0
  document.querySelector(`#current-${activePlayer}`).textContent = 0;

  // removes the active style class from the player
  document.querySelector(`.player-${activePlayer}-panel`).classList.remove("active");

  // changes the active player and resets the round score
  activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
  roundScore = 0;

  // adds the active style class to the active player
  document.querySelector(`.player-${activePlayer}-panel`).classList.add("active");

  // another way to do it is to toggle the active class; what toggle does is to add the class is the class is not there, and if the class is already there it removes it
  // document.querySelector(".player-0-panel").classList.toggle("active");
  // document.querySelector(".player-1-panel").classList.toggle("active");

  // hides the dice when it hits 1
  document.querySelector(".dice").style.display = "none";
  document.querySelector(".another-dice").style.display = "none";
}



document.querySelector(".btn-new").addEventListener("click", init);

function init() {
  // Reset the scores and the active player by default is always the Player 1 (we use 0 and 1 for the activePlayer for reading the score out of the scores array)
  
  scores = [0, 0];
  roundScore = 0;
  activePlayer = 0;
  
  setFinalScore = document.querySelector(".final-score");

  // Enable the input field
  setFinalScore.enable = "true";

  // Clear the input field
  setFinalScore.value = "";
  
  setFinalScore.addEventListener("blur", function() {
    gamePlaying = true;
  });

  // hides the dices before the game has started
  document.querySelector(".dice").style.display = "none";
  document.querySelector(".another-dice").style.display = "none";

  // zeros out all the scores
  document.getElementById("score-0").textContent = "0";
  document.getElementById("score-1").textContent = "0";
  document.getElementById("current-0").textContent = "0";
  document.getElementById("current-0").textContent = "0";

  // Change back the player name from Winner to Player
  document.querySelector("#name-0").textContent = "Player 1";
  document.querySelector("#name-1").textContent = "Player 2";
  document.querySelector(".player-0-panel").classList.remove("winner");
  document.querySelector(".player-1-panel").classList.remove("winner");
  document.querySelector(".player-0-panel").classList.remove("active");
  document.querySelector(".player-1-panel").classList.remove("active");
  document.querySelector(".player-0-panel").classList.add("active");
}