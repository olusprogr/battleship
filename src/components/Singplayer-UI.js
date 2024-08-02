// src/components/UIComponents.js

export function addTitle(scene) {
    scene.add.text(512, 100, 'War Ship', {
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

export function createGrid(scene, startX, startY, gridSize, cellSize, gridType) {
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
    return grid;
}


export function endGame(scene) {
    scene.add.rectangle(512, 384, 1024, 768, 0x000000, 0.4);

    // Handle end game logic
    scene.add.text(512, 400, 'Game Over', {
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
    scene.add.text(400, 200, 'Game Over', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);

    const restartButton = scene.add.text(400, 400, 'Restart', { fontSize: '32px', fill: '#0f0' })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.scene.restart());

    restartButton.on('pointerover', () => restartButton.setStyle({ fill: '#ff0' }));
    restartButton.on('pointerout', () => restartButton.setStyle({ fill: '#0f0' }));
}