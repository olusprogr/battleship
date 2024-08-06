class BoardCell {
    constructor(x, y, state = 'empty') {
        this.x = x;
        this.y = y;
        this.state = state;
    }
}

export default class BoardManager {
    constructor(board       ) {
        this.board = board;

        this.width = this.board.matrix[0];
        this.height = this.board.matrix[1];
        this.cells = this.createBoard();
    }

    createBoard() {
        const cells = [];
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                row.push(new BoardCell(x, y));
            }
            cells.push(row);
        }
        return cells;
    }

    placeShip(coordinates) {
        for (const { row, col } of coordinates) {
            this.cells[row][col].state = 'ship';
        }
    }

    receiveAttack(x, y) {
        const cell = this.cells[y][x];
        if (cell.state === 'ship') {
            cell.state = 'hit';
            return 'hit';
        } else if (cell.state === 'empty') {
            cell.state = 'miss';
            return 'miss';
        }
        return cell.state; // return the state if it was already hit or missed
    }

    printBoard() {
        let list = []
        for (const row of this.cells) {
            const rowString = row.map(cell => {
                switch (cell.state) {
                    case 'empty': return '.';
                    case 'ship': return 'S';
                    case 'hit': return 'X';
                    case 'miss': return 'O';
                }
            }).join(' ');
            list.push(rowString)
        }
        console.log(list.join('\n'));
    }
}

