const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restart');
const resultDisplay = document.getElementById('result');
const winsDisplay = document.getElementById('wins');
const lossesDisplay = document.getElementById('losses');
const drawsDisplay = document.getElementById('draws');
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let wins = 0;
let losses = 0;
let draws = 0;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick, { once: true });
});

restartButton.addEventListener('click', resetGame);

function handleCellClick(e) {
    const cell = e.target;
    const index = cell.getAttribute('data-index');
    
    if (gameBoard[index] !== '' || !gameActive) return;
    
    gameBoard[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer);
    animateCell(cell);
    
    if (checkWin(gameBoard, currentPlayer)) {
        resultDisplay.textContent = `${currentPlayer} wins!`;
        updateScore(currentPlayer);
        gameActive = false;
    } else if (gameBoard.every(cell => cell !== '')) {
        resultDisplay.textContent = 'Draw!';
        draws++;
        updateScore();
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (currentPlayer === 'O') {
            gameActive = false;
            setTimeout(() => {
                const bestMove = getBestMove(gameBoard);
                gameBoard[bestMove] = currentPlayer;
                const aiCell = cells[bestMove];
                aiCell.textContent = currentPlayer;
                aiCell.classList.add(currentPlayer);
                animateCell(aiCell);
                aiCell.removeEventListener('click', handleCellClick);
                if (checkWin(gameBoard, currentPlayer)) {
                    resultDisplay.textContent = `${currentPlayer} wins!`;
                    updateScore(currentPlayer);
                } else if (gameBoard.every(cell => cell !== '')) {
                    resultDisplay.textContent = 'Draw!';
                    draws++;
                    updateScore();
                }
                currentPlayer = 'X';
                gameActive = true;
            }, 500);
        }
    }
}

function checkWin(board, player) {
    return winningCombinations.some(combination => {
        return combination.every(index => board[index] === player);
    });
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell';
        cell.addEventListener('click', handleCellClick, { once: true });
    });
    currentPlayer = 'X';
    gameActive = true;
    resultDisplay.textContent = '';
}

function animateCell(cell) {
    cell.classList.add('animate');
    setTimeout(() => cell.classList.remove('animate'), 300);
}

function getBestMove(board) {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    if (checkWin(board, 'O')) return 10 - depth;
    if (checkWin(board, 'X')) return depth - 10;
    if (board.every(cell => cell !== '')) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function updateScore(winner) {
    if (winner === 'X') {
        wins++;
        winsDisplay.textContent = wins;
    } else if (winner === 'O') {
        losses++;
        lossesDisplay.textContent = losses;
    } else {
        drawsDisplay.textContent = draws;
    }
}
