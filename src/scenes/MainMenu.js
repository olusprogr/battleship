import { Scene } from 'phaser';
import * as components from '../components/MainMenu-UI.js'

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');

        this.windowWidth = window.innerWidth
        this.windowsHeight = window.innerHeight
        this.mobile = false
    }

    create ()
    {
        const centerX = this.windowWidth / 2;
        const centerY = this.windowHeight / 2;
        let sensibility = 1;

        let heightOfBackground = 700;
        if (this.windowWidth < 768) {
            this.mobile = true;
            heightOfBackground = 300;
            sensibility = 0.5;
        }

        // Added basic main menu items
        const background = components.addImage(this);

        let isAnimationRunning = true;
        let settingsButtonCliked = false;
        let tweens;
        let delay;

        // to fixing
        const title = components.titleText(this);
        const gradient = title.context.createLinearGradient(0, 0, 0, title.height);
        gradient.addColorStop(0, '#dbd9d9');
        gradient.addColorStop(0.5, '#adacac');
        gradient.addColorStop(1, '#dbd9d9');
        title.setFill(gradient);

        title.setShadow(5, 5, '#1a1a1a', 5, true, true);

        components.randomFloatTween(this);

        const scale = this.windowWidth < 768 ? 0.5 : 1; // If window width is less than 768px (common mobile width), scale to 80%
        background.setScale(scale);
        background.setOrigin(0.5);

        components.settingsButtonAndFunctionality(this);


        const createButtonBackground = (x, y, width, height) => {
            const background = this.add.graphics();
            background.fillStyle(0x555555, 0.5); // Gray color with 0.5 transparency
            background.fillRect(x - width / 2, y - height / 2, width, height);
            return background;
        };

        createButtonBackground(centerX, 350, 200, 60);
        components.singleplayerButton(this);

        createButtonBackground(centerX, 450, 450, 60);
        components.multiplayerButton(this);

        components.madeBy(this);
    }
}
