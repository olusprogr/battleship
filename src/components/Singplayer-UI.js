// src/components/UIComponents.js

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

const windowsWidthCentered = windowWidth / 2;
const windowsHeightCentered = windowHeight / 2;

export function addTitle(scene) {
    scene.add.text(windowsWidthCentered, 100, 'War Ship', {
        fontFamily: 'Arial Black',
        fontSize: 80,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center'
    }).setOrigin(0.5);
}

export function addImage(scene) {
    scene.add.image(512, 484, 'war-ship');
}

function distributeFrames(totalWidth, ...frameWidths) {
    const totalFramesWidth = frameWidths.reduce((acc, width) => acc + width, 0);
    const restSpace = totalWidth - totalFramesWidth;

    // Number of gaps is the number of frames plus two (one at each end)
    const numberOfGaps = frameWidths.length + 1;

    // Calculate the spacing, including space at the beginning and end
    return restSpace / numberOfGaps;
}


function calculateCellSize() {
    const minDimension = Math.min(windowWidth, windowHeight);
    return Math.floor(minDimension / (10 + 2) * 0.4);  // +2 für Ränder
}

export function createGrid(scene, gridType) {
    // Creating grids for the player and opponent
    let gridSize = 10;  // 10x10 grid
    let cellSize = 30;  // Size of each cell in pixels
    let startX;
    let startY = 200;
    let asw;

    // cellSize = calculateCellSize();

    // gridSize = Math.min(windowWidth, windowHeight) / 20; // Beispiel: 5% der kleineren Dimension

    let gridTotal = cellSize * gridSize; // 300
    if (windowWidth < 768) {
        if (gridType === 'player') {
            startX = (windowWidth - gridTotal) / 2;
            startY = 160;
        }

        else {
            startX = (windowWidth - gridTotal) / 2;
            startY = 510;
        }
    } else {
        const frameWidths = [gridTotal, gridTotal]; // Breiten der Frames
        asw = distributeFrames(windowWidth, ...frameWidths);

        if (gridType === 'player') { startX = asw }
        else { startX = windowWidth - asw - gridTotal; }
    }

    console.log(asw)

    const grid = scene.add.container(0, 0);
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const x = startX + col * cellSize;
            const y = startY + row * cellSize;
            const cell = scene.add.rectangle(x, y, cellSize, cellSize, 0x808080).setOrigin(0);
            cell.setStrokeStyle(1, 0x000000);  // Add a border to the cells
            cell.setInteractive();  // Make the cell interactive
            cell.row = row;
            cell.col = col;
            cell.gridType = gridType; // Indicate which grid the cell belongs to
            cell.isOccupied = false; // Indicate if the cell is occupied by a ship
            cell.isAlreadyBeenHitten = false; // Indicate if the cell already has been hitten by a missle

            // Handle pointer down (click) event
            cell.on('pointerdown', () => {
                scene.cellClicked(cell);
            });

            grid.add(cell);
        }
    }
    grid.matrix = [10, 10]
    return grid;
}

export function endGame(scene) {
    if (!scene.gameOverText) {
        scene.gameOverText = scene.add.text(windowsWidthCentered, 400, 'Game Over', {
            fontFamily: 'Arial Black',
            fontSize: '80px',
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setAlpha(1);

        const overlay = scene.add.rectangle(windowsWidthCentered, windowsHeightCentered, windowWidth, windowHeight, 0x000000, 0.4);
    }

    setTimeout(() => {
        scene.gameOverText.visible = false;
        scene.overlay.visible = false;
    }, 4000);
}


export function addRestartButton(scene) {
    let startY = 600;
    console.log(windowWidth)
    if (windowWidth < 768) {
        startY = 860;
    }

    const restartButton = scene.add.text(windowsWidthCentered, startY, 'Restart', { fontSize: '32px', fill: '#0f0' })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => scene.scene.restart(), scene.restartReady = true);

    restartButton.on('pointerover', () => restartButton.setStyle({ fill: '#ff0' }));
    restartButton.on('pointerout', () => restartButton.setStyle({ fill: '#0f0' }));
}

export function addBackToMenuButton(scene) {
    let startY = 600;
    let startX = 100;

    if (windowWidth < 1000) {
        startY = 0;
        startX = 900;
    }
    


    const backToMenuButton = scene.add.text(windowsWidthCentered - startY, startX, 'Back to Menu', { fontSize: '30px', fill: '#0f0' })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => scene.scene.start('MainMenu'));

    backToMenuButton.on('pointerover', () => backToMenuButton.setStyle({ fill: '#ff0' }));
    backToMenuButton.on('pointerout', () => backToMenuButton.setStyle({ fill: '#0f0' }));
}