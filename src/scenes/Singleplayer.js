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
        this.playerTurn = true; // Track whose turn it is
        this.lastHit = null; // Last hit of the robot
    }

    update() {
        if (this.allShipsArePlaced && this.opponentShipsPlaced === false) {
            this.placeOpponentShips();
        }
        if (this.allShipsArePlaced && this.opponentShipsPlaced) {
            // Continue game logic here
            if (this.checkGameOver()) {
                this.endGame();
            }
        }
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
                    cell.isAlreadyBeenHitten = false; // Indicate if the cell already has been hitten by a missle

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
        // Handle the cell click event
        if (this.playerTurn) {
            if (cell.gridType === 'player') {
                this.placeShip(cell);
            } else if (cell.gridType === 'opponent') {
                this.attackCell(cell);
            }
        }
    }

    placeShip(startCell) {
        if (this.allShipsArePlaced) { return }
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
                        // cell.fillColor = 0xA9A9A9; // Change the color of the cell to blue
                        cell.isOccupied = true; // Mark the cell as occupied
                    });
                    placed = true;
                    this.opponentShipsPlaced = true;
                }
            }
        });
    }

    attackCell(cell) {
        // Handle the attack on the opponent's grid
        if (cell.isAlreadyBeenHitten) {return}
        if (!cell.isOccupied) {
            cell.fillColor = 0x0000ff; // Miss
        } else {
            cell.fillColor = 0xff0000; // Hit
        }
        cell.isOccupied = false; // Mark cell as attacked
        this.playerTurn = false; // Switch turn to opponent
        cell.isAlreadyBeenHitten = true; // Mark cell as hitten

        // Call opponent's turn after a delay
        this.time.delayedCall(100, () => {
            this.opponentAttack();
        });
    }

    opponentAttack() {
        let attacked = false;
        while (!attacked) {
            if (this.lastHit !== null) {
                const lastRow = this.lastHit.row;
                const lastCol = this.lastHit.col;
                let availablePlaces = [];
                let foundValidCell = false;
                let cell;

                const up = this.getCellAt(lastRow + 1, lastCol, this.playerGrid);
                const down = this.getCellAt(lastRow - 1, lastCol, this.playerGrid);
                const left = this.getCellAt(lastRow, lastCol - 1, this.playerGrid);
                const right = this.getCellAt(lastRow, lastCol + 1, this.playerGrid);

                availablePlaces.push(up, down, left, right);
                availablePlaces = availablePlaces.filter(cell => cell !== undefined && !cell.isAlreadyBeenHitten);
                let randomDirection = Math.floor(Math.random() * availablePlaces.length);

                if (availablePlaces.length > 0) {
                    cell = availablePlaces[randomDirection];
                    foundValidCell = true;
                }
    
                if (foundValidCell) {
                    if (cell.isOccupied && !cell.isAlreadyBeenHitten) {
                        cell.fillColor = 0xff0000; // red
                        cell.isOccupied = false;
                        cell.isAlreadyBeenHitten = true;
                        attacked = true;
                        this.lastHit = { row: cell.row, col: cell.col };
                    } else if (!cell.isOccupied) {
                        cell.fillColor = 0x0000ff; // blue
                        cell.isAlreadyBeenHitten = true;
                        attacked = true;
                    }
                } else {
                    this.lastHit = null;
                }

            } else {
                while (!attacked) {
                    const row = Math.floor(Math.random() * 10);
                    const col = Math.floor(Math.random() * 10);
                    const cell = this.getCellAt(row, col, this.playerGrid);
        
                    if (!cell.isAlreadyBeenHitten) {
                        if (cell.isOccupied) {
                            cell.fillColor = 0xff0000; // red
                            cell.isOccupied = false;
                            cell.isAlreadyBeenHitten = true;
                            attacked = true;
                            this.lastHit = { row: cell.row, col: cell.col };
                            break;
                        } else {
                            cell.fillColor = 0x0000ff; // blue
                            cell.isAlreadyBeenHitten = true;
                        }
                        attacked = true;
                    }

                    console.log(cell.isAlreadyBeenHitten)
                }
            }
        }
        this.playerTurn = true;
    }
    

    checkGameOver() {
        // Check if all ships of one player are sunk
        const playerShips = this.playerGrid.getAll().filter(cell => cell.isOccupied).length;
        const opponentShips = this.opponentGrid.getAll().filter(cell => cell.isOccupied).length;

        if (playerShips === 0 || opponentShips === 0) {
            return true;
        }
        return false;
    }

    endGame() {
        // Handle end game logic
        this.add.text(512, 400, 'Game Over', {
            fontFamily: 'Arial Black',
            fontSize: 80,
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
        this.scene.pause();
    }
}
