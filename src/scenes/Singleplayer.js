import { Scene } from 'phaser';
import ShipManager from '../objects/ship.js';
import BoardManager from '../objects/board.js';
import * as components from '../components/Singplayer-UI.js';

export class Singleplayer extends Scene {
    constructor() {
        super('Singleplayer');

        this.opponentShips = new ShipManager()
        this.playerShips = new ShipManager()

        this.currentShipIndex = 0; // Index of the current ship to be placed
        this.isVertical = false; // Orientation of the ship (horizontal/vertical)
        this.playerTurn = true; // Track whose turn it is
        this.lastHit = null; // Last hit of the robot
    }

    update() {
        if (this.playerShips.allShipsPlaced() && !this.opponentShips.allShipsPlaced()) { this.placeOpponentShips() }
        if (this.playerShips.allShipsPlaced() && this.opponentShips.allShipsPlaced()) {
            if (this.checkGameOver()) {
                this.endGame();
            }
        }
    }

    create() {
        components.addImage(this);
        components.addTitle(this);

        // Create player and opponent grids
        this.playerGrid = components.createGrid(this, 'player');
        this.opponentGrid = components.createGrid(this, 'opponent');
        this.playerBoard = new BoardManager(this.playerGrid);
        this.opponentBoard = new BoardManager(this.opponentGrid);

        // Listen for the 'R' key to rotate the ship
        this.input.keyboard.on('keydown-R', () => {
            this.isVertical = !this.isVertical;
        });

        components.addRestartButton(this);
        components.addBackToMenuButton(this);
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
        if (this.currentShipIndex >= this.playerShips.ships.length) { return }
        const ship = this.playerShips.ships[this.currentShipIndex];
        const cellsToOccupy = [];

        // Calculate the cells the ship would occupy
        for (let i = 0; i < ship.size; i++) {
            const row = this.isVertical ? startCell.row + i : startCell.row;
            const col = this.isVertical ? startCell.col : startCell.col + i;

            // Check if the cell is within bounds and not occupied
            const cell = this.getCellAt(row, col, this.playerGrid);
            if (!cell || cell.isOccupied) { return };
            cellsToOccupy.push(cell);

            // Save the coordinates and orientation of the ship
            this.playerShips.saveCoordinates(ship.name, row, col);
            this.playerBoard.printBoard();
        }


        // Place the ship
        cellsToOccupy.forEach(cell => {
            cell.fillColor = 0x00ff00; // Change the color of the cell to green
            cell.isOccupied = true; // Mark the cell as occupied
        });

        // Move to the next ship
        console.log(startCell.row, startCell.col)
        this.playerShips.setOrientation(ship.name, this.isVertical ? 'vertical' : 'horizontal');
        // this.playerBoard.placeShip(startCell.row, startCell.col, ship.size, this.isVertical);
        this.playerShips.setShipPlaced(ship.name, true);
        this.currentShipIndex++;
        if (this.playerShips.allShipsPlaced()) { this.playerTurn = false }
        console.log(this.playerShips)
    }

    getCellAt(row, col, grid) {
        return grid.getAll().find(cell => cell.row === row && cell.col === col);
    }

    placeOpponentShips() {
        this.opponentShips.ships.forEach(ship => {
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
                        cellsToOccupy.length = 0;
                        break;
                    }
                    cellsToOccupy.push(cell);
                }

                if (cellsToOccupy.length === ship.size) {
                    cellsToOccupy.forEach(cell => {
                        // cell.fillColor = 0xA9A9A9; // Change the color of the cell to blue
                        cell.isOccupied = true; // Mark the cell as occupied
                        this.opponentShips.saveCoordinates(ship.name, cell.row, cell.col); // Save the correct coordinates
                    });
                    placed = true;
                    this.opponentShips.setShipPlaced(ship.name, true);
                }
            }
        });
        this.playerTurn = true; // Switch turn to player
    }

    attackCell(cell) {
        // Handle the attack on the opponent's grid
        if (cell.isAlreadyBeenHitten) {return}
        if (!cell.isOccupied) {
            cell.fillColor = 0x0000ff; // Miss
        } else {
            cell.fillColor = 0xff0000; // Hit
            cell.isOccupied = false; // Mark cell as attacked
        }
        this.playerTurn = false; // Switch turn to opponent
        cell.isAlreadyBeenHitten = true; // Mark cell as hitten

        // Call opponent's turn after a delay
        this.time.delayedCall(1000, () => {
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
                } else { this.lastHit = null }

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
                }
            }
        }
        this.playerTurn = true; // Switch turn to player
    }
    
    checkGameOver() {
        // Check if all ships of one player are sunk
        const playerShips = this.playerGrid.getAll().filter(cell => cell.isOccupied).length;
        const opponentShips = this.opponentGrid.getAll().filter(cell => cell.isOccupied).length;

        if (playerShips === 0 || opponentShips === 0) { return true }
        return false;
    }

    endGame() { components.endGame(this) }
}
