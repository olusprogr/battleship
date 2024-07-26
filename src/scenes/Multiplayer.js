import { Scene } from "phaser";

export class Multiplayer extends Scene
{
    constructor()
    {
        super('Multiplayer');
    }

    create()
    {
        this.add.image(512, 484, 'war-ship')
    }
}