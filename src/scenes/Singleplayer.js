import { Scene } from 'phaser'

export class Singleplayer extends Scene
{
    constructor()
    {
        super('Singleplayer');
    }

    create()
    {
        this.add.image(512, 484, 'war-ship');
        

        // Creating grid for the battlefield
        const gridSize = 10;  // 10x10 grds
        const cellSize = 30;  // Size of every field in pixels
        const startX = 500;   // Startposition for X
        const startY = 50;    // Startposition for Y

        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const x = startX + col * cellSize;
                const y = startY + row * cellSize;
                this.add.rectangle(x, y, cellSize, cellSize, 0x00ffff).setOrigin(0);
            }
        }
        
    }
}