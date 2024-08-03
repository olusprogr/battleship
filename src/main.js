import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Multiplayer } from './scenes/Multiplayer';
import { Preloader } from './scenes/Preloader';
import { Singleplayer } from './scenes/Singleplayer'


const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Singleplayer,
        Multiplayer,
        Game,
        GameOver
    ]
};

export default new Phaser.Game(config);
