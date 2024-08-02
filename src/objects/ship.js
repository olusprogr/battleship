export default class ShipManager {
    constructor() {
        this.ships = [
            { name: 'Carrier', size: 5, coordinates: [], orientation: 'horizontal', sunk: false, placed: false },
            { name: 'Battleship', size: 4, coordinates: [], orientation: 'horizontal', sunk: false, placed: false },
            { name: 'Cruiser', size: 3, coordinates: [], orientation: 'horizontal', sunk: false, placed: false },
            { name: 'Submarine', size: 3, coordinates: [], orientation: 'horizontal', sunk: false, placed: false },
            { name: 'Destroyer', size: 2, coordinates: [], orientation: 'horizontal', sunk: false, placed: false }
        ];
    }

    getShips() { return this.ships };

    getShip(name) { return this.ships.find(ship => ship.name === name) };

    setShipCoordinates(name, coordinates) { this.ships.find(ship => ship.name === name).coordinates = coordinates };

    setShipSunk(name, sunk) { this.ships.find(ship => ship.name === name).sunk = sunk };

    allShipsSunk() { return this.ships.every(ship => ship.sunk) };

    resetShips() { this.ships.forEach(ship => { ship.coordinates = []; ship.sunk = false; }) };

    saveCoordinates(ship, row, col) { this.ships.find(s => s.name === ship).coordinates.push({row, col}) };

    setShipPlaced(name, placed) { this.ships.find(ship => ship.name === name).placed = placed };

    allShipsPlaced() { return this.ships.every(ship => ship.placed) };
}
