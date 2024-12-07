let remainingO = 6; // Increased to 6
let remainingX = 5;
let remainingF = 5;
let selectedLetter = null;
let grid = [];

function startNewGame() {
    remainingO = 6; // Reset to 6
    remainingX = 5;
    remainingF = 5;
    selectedLetter = null;
    grid = [];
    document.getElementById('remaining-o').textContent = remainingO;
    document.getElementById('remaining-x').textContent = remainingX;
    document.getElementById('remaining-f').textContent = remainingF;
    document.getElementById('status').textContent = '';

    createGrid();
    enableLetterSelection();
}

function createGrid() {
    const gridContainer = document.getElementById('grid');
    gridContainer.innerHTML = '';

    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        cell.addEventListener('click', () => handleCellClick(i));
        gridContainer.appendChild(cell);
        grid.push(cell);
    }
}

function handleCellClick(index) {
    if (!selectedLetter) {
        alert('Please select a letter first!');
        return;
    }

    const cell = grid[index];
    if (cell.textContent !== '') {
        alert('This cell already has a letter!');
        return;
    }

    // Place the selected letter
    if (updateRemainingLetters(selectedLetter)) {
        cell.textContent = selectedLetter;
        cell.classList.add('animated');
    }

    if (checkForFox()) {
        document.getElementById('status').textContent = 'You spelled "FOX"! Game Over!';
        disableGrid();
    }
}

function selectLetter(letter) {
    if (letter === 'F' && remainingF > 0) {
        selectedLetter = 'F';
    } else if (letter === 'O' && remainingO > 0) {
        selectedLetter = 'O';
    } else if (letter === 'X' && remainingX > 0) {
        selectedLetter = 'X';
    } else {
        alert(`No remaining ${letter}s!`);
        return;
    }

    document.getElementById('status').textContent = `Selected Letter: ${letter}`;
}

function updateRemainingLetters(letter) {
    if (letter === 'F' && remainingF > 0) {
        remainingF--;
        document.getElementById('remaining-f').textContent = remainingF;
        return true;
    } else if (letter === 'O' && remainingO > 0) {
        remainingO--;
        document.getElementById('remaining-o').textContent = remainingO;
        return true;
    } else if (letter === 'X' && remainingX > 0) {
        remainingX--;
        document.getElementById('remaining-x').textContent = remainingX;
        return true;
    }

    return false; // No letter placed if the count is zero
}

function checkForFox() {
    // Check rows
    for (let i = 0; i < 16; i += 4) {
        for (let j = 0; j < 2; j++) {
            if (
                grid[i + j].textContent === 'F' &&
                grid[i + j + 1].textContent === 'O' &&
                grid[i + j + 2].textContent === 'X'
            ) {
                return true;
            }
        }
    }

    // Check columns
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 8; j += 4) {
            if (
                grid[i + j].textContent === 'F' &&
                grid[i + j + 4].textContent === 'O' &&
                grid[i + j + 8].textContent === 'X'
            ) {
                return true;
            }
        }
    }

    // Check diagonals
    if (
        (grid[0].textContent === 'F' &&
            grid[5].textContent === 'O' &&
            grid[10].textContent === 'X') ||
        (grid[3].textContent === 'F' &&
            grid[6].textContent === 'O' &&
            grid[9].textContent === 'X')
    ) {
        return true;
    }

    return false;
}

function disableGrid() {
    grid.forEach((cell) => {
        cell.style.pointerEvents = 'none';
    });
}

function enableLetterSelection() {
    document.getElementById('status').textContent = '';
}

// Start the game
startNewGame();
