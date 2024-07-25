import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('war-ship', 'assets/war-ship-bg.jpeg');
        this.load.image('background', 'assets/bg.png');

        this.load.audio('background-music', 'assets/sounds/background-music.mp3');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
