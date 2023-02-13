const statusDisplay = document.querySelector('.status');

let gameActive = true;
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];

var humanScore=0;
var ComputerScore=0;
var tieScore=0;

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

statusDisplay.innerHTML = currentPlayerTurn();

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];


// Select randomly the starter player
function selectStartPlayer() {
    var startPlayer =Math.floor(Math.random() * 2);
    if(startPlayer==0){
        currentPlayer = "O";
        handleComputerMove();
    }
    console.log(`Start player is : ${startPlayer}`);
}

// On loading event call the player selection
window.addEventListener('load', (event) => {
    console.log('The page has fully loaded');
    selectStartPlayer();
});

// this handle the updating of the board
function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

function checkwin() {
    let roundWon = false;
    var winnerCombination = [];
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            //select winning cells and apply the style to differecniate 
            winnerCombination.push(winCondition[0]);
            winnerCombination.push(winCondition[1]);
            winnerCombination.push(winCondition[2]);
            console.log("winnerComb: "+winnerCombination.toString());
            document.querySelector([`[data-cell-index="${winnerCombination[0].toString()}"]`]).classList.add("winnerCell");
            document.querySelector([`[data-cell-index="${winnerCombination[1].toString()}"]`]).classList.add("winnerCell");
            document.querySelector([`[data-cell-index="${winnerCombination[2].toString()}"]`]).classList.add("winnerCell");
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        statusDisplay.style.color = "rgb(251,100,204)";
        //increase player counter depending of the winners
        currentPlayer === "X" ? humanScore++ : ComputerScore++;

        setTimeout(function () {
            // automatic restart the game after 2.5sec
            handleRestartGame();
            // remove the style for winnig cel;s
            document.querySelector([`[data-cell-index="${winnerCombination[0].toString()}"]`]).classList.remove("winnerCell");
            document.querySelector([`[data-cell-index="${winnerCombination[1].toString()}"]`]).classList.remove("winnerCell");
            document.querySelector([`[data-cell-index="${winnerCombination[2].toString()}"]`]).classList.remove("winnerCell");  
        }, 2500);
        return;
        
    
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        statusDisplay.style.color = "rgb(251,100,204)";
        //increase tie counter
        tieScore++;
        // automatic restart the game after 2.5sec
        setTimeout(function () {
            handleRestartGame();  
        }, 2500);
        return;
    }
    handlePlayerChange();

}

function handleResultValidation() {
    checkwin();
    if (gameActive) {
        handleComputerMove();
    }

}

function handleComputerMove() {
    setTimeout(function () {
        pickComputerMove();
        checkwin();
    }, 500);

   

}

function pickComputerMove() {
    while (true) {
        //loop through gameState and first available spot
        var m = Math.floor(Math.random() * 8);
        if (gameState[m] === '') { // looking for empty state
            break;
        }
        console.log('m is = ' + m);
    }
    // m will have computer move
    gameState[m] = currentPlayer
    //will have the spot 

    // #################### Important
    // this is the way with js to select the cell with data-cell-index value is equal m
    // other way is using jQuery
    document.querySelector([`[data-cell-index="${m}"]`]).innerHTML = currentPlayer
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    // check if current cell is availbale and the game is in an active state
    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();

}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.style.color = "rgb(65, 65, 65)";
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
    //update during restart game the score board
    document.querySelector(".human").innerHTML = (humanScore).toString();
    document.querySelector(".computer").innerHTML = (ComputerScore).toString();
    document.querySelector(".ties").innerHTML = (tieScore).toString();
    // randomly selecting start player
    selectStartPlayer();
}

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.restart').addEventListener('click', handleRestartGame);