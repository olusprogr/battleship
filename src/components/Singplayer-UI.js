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

export function createGrid(scene, gridType) {
    // Creating grids for the player and opponent
    const gridSize = 10;  // 10x10 grid
    const cellSize = 30;  // Size of each cell in pixels
    const startY = 200;    // Starting Y position
    let startX

    if (gridType === 'player') { startX = 200 };
    if (gridType === 'opponent') { startX = 600 };

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
    scene.add.rectangle(windowsWidthCentered, 384, 1024, 768, 0x000000, 0.4);

    // Handle end game logic
    scene.add.text(windowsWidthCentered, 400, 'Game Over', {
        fontFamily: 'Arial Black',
        fontSize: 80,
        color: '#ff0000',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center'
    }).setOrigin(0.5);
    scene.scene.pause();
}

export function addRestartButton(scene) {
    const restartButton = scene.add.text(windowsWidthCentered, 600, 'Restart', { fontSize: '32px', fill: '#0f0' })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => scene.scene.restart());

    restartButton.on('pointerover', () => restartButton.setStyle({ fill: '#ff0' }));
    restartButton.on('pointerout', () => restartButton.setStyle({ fill: '#0f0' }));
}

export function addBackToMenuButton(scene) {
    const backToMenuButton = scene.add.text(windowsWidthCentered - 400, 100, 'Back to Menu', { fontSize: '30px', fill: '#0f0' })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => scene.scene.start('MainMenu'));

    backToMenuButton.on('pointerover', () => backToMenuButton.setStyle({ fill: '#ff0' }));
    backToMenuButton.on('pointerout', () => backToMenuButton.setStyle({ fill: '#0f0' }));
}