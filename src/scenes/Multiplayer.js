import { Scene } from "phaser";

export class Multiplayer extends Scene
{
    constructor()
    {
        super('Multiplayer');
    }

    create()
    {
        this.add.image(100, 100, 'war-ship')
    }
}