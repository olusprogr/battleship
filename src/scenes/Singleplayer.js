import { Scene } from 'phaser';

export class Singleplayer extends Scene {
    constructor() {
        super('Singleplayer');
    }

    create() {
        this.add.image(512, 484, 'war-ship');

        // Add the title
        const title = this.add.text(512, 100, 'War Ship', {
            fontFamily: 'Arial Black',
            fontSize: 80,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // Creating grids for the player and opponent
        const gridSize = 10;  // 10x10 grid
        const cellSize = 30;  // Size of each cell in pixels
        const playerStartX = 200;   // Starting X position for player grid
        const opponentStartX = 600; // Starting X position for opponent grid
        const startY = 200;    // Starting Y position

        // Function to create a grid
        const createGrid = (startX, gridType) => {
            const grid = this.add.container(0, 0);
            for (let row = 0; row < gridSize; row++) {
                for (let col = 0; col < gridSize; col++) {
                    const x = startX + col * cellSize;
                    const y = startY + row * cellSize;
                    const cell = this.add.rectangle(x, y, cellSize, cellSize, 0x808080).setOrigin(0);
                    cell.setStrokeStyle(1, 0x000000);  // Add a border to the cells
                    cell.setInteractive();  // Make the cell interactive
                    cell.row = row;
                    cell.col = col;
                    cell.gridType = gridType; // Indicate which grid the cell belongs to

                    // Handle pointer down (click) event
                    cell.on('pointerdown', () => {
                        this.cellClicked(cell);
                    });

                    grid.add(cell);
                }
            }
            return grid;
        };

        // Create player and opponent grids
        this.playerGrid = createGrid(playerStartX, 'player');
        this.opponentGrid = createGrid(opponentStartX, 'opponent');
    }

    cellClicked(cell) {
        // Handle the cell click event
        if (cell.gridType === 'player') {
            // Logic for player's grid click
            cell.fillColor = 0x00ff00; // Change the color of the cell to green
        } else if (cell.gridType === 'opponent') {
            // Logic for opponent's grid click
            cell.fillColor = 0xff0000; // Change the color of the cell to red
        }
        // Add more logic here (e.g., place ships, mark hits/misses)
    }
}
