import { Scene } from 'phaser';

export class Singleplayer extends Scene {
    constructor() {
        super('Singleplayer');

        // Define the ships and their sizes
        this.ships = [
            { name: 'Carrier', size: 5 },
            { name: 'Battleship', size: 4 },
            { name: 'Cruiser', size: 3 },
            { name: 'Submarine', size: 3 },
            { name: 'Destroyer', size: 2 }
        ];

        this.currentShipIndex = 0; // Index of the current ship to be placed
        this.isVertical = false; // Orientation of the ship (horizontal/vertical)
        this.allShipsArePlaced = false;
        this.opponentShipsPlaced = false;
    }

    update() {
        if (this.allShipsArePlaced && this.opponentShipsPlaced === false) {this.placeOpponentShips()}
    }

    create() {
        this.add.image(512, 484, 'war-ship');

        // Add the title
        this.add.text(512, 100, 'War Ship', {
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
                    cell.isOccupied = false; // Indicate if the cell is occupied by a ship

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

        // Listen for the 'R' key to rotate the ship
        this.input.keyboard.on('keydown-R', () => {
            this.isVertical = !this.isVertical;
        });
    }

    cellClicked(cell) {
        // Handle the cell click event for placing ships
        if (cell.gridType === 'player') {
            this.placeShip(cell);
        } else if (cell.gridType === 'opponent') {
            // Logic for opponent's grid click
            cell.fillColor = 0xff0000; // Change the color of the cell to red
        }
    }

    placeShip(startCell) {
        if (this.allShipsArePlaced) {return}
        const ship = this.ships[this.currentShipIndex];
        const cellsToOccupy = [];

        // Calculate the cells the ship would occupy
        for (let i = 0; i < ship.size; i++) {
            const row = this.isVertical ? startCell.row + i : startCell.row;
            const col = this.isVertical ? startCell.col : startCell.col + i;

            // Check if the cell is within bounds and not occupied
            const cell = this.getCellAt(row, col, this.playerGrid);
            if (!cell || cell.isOccupied) {
                return; // Invalid placement
            }
            cellsToOccupy.push(cell);
        }

        // Place the ship
        cellsToOccupy.forEach(cell => {
            cell.fillColor = 0x00ff00; // Change the color of the cell to green
            cell.isOccupied = true; // Mark the cell as occupied
        });

        // Move to the next ship
        this.currentShipIndex++;
        if (this.currentShipIndex >= this.ships.length) {
            this.currentShipIndex = 0; // All ships placed
            this.allShipsArePlaced = true;
        }
    }

    getCellAt(row, col, grid) {
        return grid.getAll().find(cell => cell.row === row && cell.col === col);
    }

    placeOpponentShips() {
        this.ships.forEach(ship => {
            let placed = false;
            while (!placed) {

                // Generating random place for ship
                const isVertical = Math.random() < 0.5;
                const startRow = Math.floor(Math.random() * (isVertical ? 10 - ship.size : 10));
                const startCol = Math.floor(Math.random() * (isVertical ? 10 : 10 - ship.size));

                const cellsToOccupy = [];
                for (let i = 0; i < ship.size; i++) {
                    const row = isVertical ? startRow + i : startRow;
                    const col = isVertical ? startCol : startCol + i;
                    const cell = this.getCellAt(row, col, this.opponentGrid);
                    if (!cell || cell.isOccupied) {
                        cellsToOccupy.length = 0; // Invalid placement
                        break;
                    }
                    cellsToOccupy.push(cell);
                }

                if (cellsToOccupy.length === ship.size) {
                    cellsToOccupy.forEach(cell => {
                        cell.fillColor = 0xA9A9A9; // Change the color of the cell to blue
                        cell.isOccupied = true; // Mark the cell as occupied
                    });
                    placed = true;
                    this.opponentShipsPlaced = true
                }
            }
        });
    }
}
