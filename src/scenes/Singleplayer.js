import { Scene } from 'phaser'

export class Singleplayer extends Scene
{
    constructor()
    {
        super('Singleplayer');
    }

    create()
    {
        this.add.image(100, 100, 'war-ship');
    }
}