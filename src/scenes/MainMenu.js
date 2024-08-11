import { Scene } from 'phaser';

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
        let background = this.add.image(centerX, heightOfBackground, 'war-ship');


        function randomFloatTween() {
            // Randomly choose a direction for x and y movement
            function getRandomOffset() {
                let offset;
                do {
                    offset = Phaser.Math.Between(-15, 15);
                } while (offset >= -5 && offset <= 5);
                return offset;
            }
            
            let randomX = getRandomOffset() * sensibility;
            let randomY = getRandomOffset() * sensibility;
            
        
            this.tweens.add({
                targets: background,
                x: background.x + randomX,  // move randomly left or right
                y: background.y + randomY,  // move randomly up or down
                duration: Phaser.Math.Between(600, 800), // random duration between 1 and 2 seconds
                yoyo: true,
                repeat: 0,
                ease: 'Sine.easeInOut',
                onComplete: randomFloatTween, // repeat the tween with a new random direction
                callbackScope: this,
                onComplete: () => {
                    // Introduce a 200ms pause before the next movement
                    this.time.delayedCall(30, randomFloatTween, [], this);
                },
            });
        }
        
        // Start the floating animation
        randomFloatTween.call(this);

        // Scale the background image down a bit to show more of it on smaller screens
        const scale = this.windowWidth < 768 ? 0.5 : 1; // If window width is less than 768px (common mobile width), scale to 80%
        background.setScale(scale);
        background.setOrigin(0.5);

        // Settings button and functionality
        const settingsButton = this.add.image(this.windowWidth - 50 , 50, 'settings')
            .setInteractive()
            .setScale(0.5);

        settingsButton.on('pointerdown', () => {
            console.log('Settings-Button geklickt');
        });


        // Creating a more visually appealing "War Ship" title with a metallic, grungy black and white style
        const titleText = this.add.text(centerX, 200, 'War Ship', {
            fontFamily: 'Arial Black', 
            fontSize: Math.min(this.windowWidth * 0.15, 80), 
            color: '#ffffff',
            stroke: '#000000', 
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // Adding gradient effect to the text
        const gradient = titleText.context.createLinearGradient(0, 0, 0, titleText.height);
        gradient.addColorStop(0, '#dbd9d9');
        gradient.addColorStop(0.5, '#adacac');
        gradient.addColorStop(1, '#dbd9d9');
        titleText.setFill(gradient);

        // Adding shadow to the text
        titleText.setShadow(5, 5, '#1a1a1a', 5, true, true);

        const createButtonBackground = (x, y, width, height) => {
            const background = this.add.graphics();
            background.fillStyle(0x555555, 0.5); // Gray color with 0.5 transparency
            background.fillRect(x - width / 2, y - height / 2, width, height);
            return background;
        };

        // Singleplayer button settings
        createButtonBackground(centerX, 350, 200, 60);
        const singleplayerButton = this.add.text(centerX, 350, 'Singleplayer', {
            fontFamily: 'Arial',
            fontSize: Math.min(this.windowWidth * 0.05, 32),
            color: '#cccccc',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setInteractive();
        // In case of adding further functionality to the button just add it here under the pointerdown events

        singleplayerButton.on('pointerover', () => {
            singleplayerButton.setStyle({ fill: '#ffffff' });
            singleplayerButton.setScale(1.05);
        });

        singleplayerButton.on('pointerout', () => {
            singleplayerButton.setStyle({ fill: '#cccccc' });
            singleplayerButton.setScale(1);
        });

        singleplayerButton.on('pointerdown', () => {
            this.scene.start('Singleplayer');
        });

        // Multiplayer button settings
        createButtonBackground(centerX, 450, 450, 60);
        const multiplayerButton = this.add.text(centerX, 450, 'Multiplayer (Not available yet)', {
            fontFamily: 'Arial',
            fontSize: Math.min(this.windowWidth * 0.05, 32), 
            color: '#cccccc',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setInteractive();
        // In case of adding further functionality to the button just add it here under the pointerdown events

        multiplayerButton.on('pointerover', () => {
            multiplayerButton.setStyle({ fill: '#ffffff' });
            multiplayerButton.setScale(1.05);
        });

        multiplayerButton.on('pointerout', () => {
            multiplayerButton.setStyle({ fill: '#cccccc' });
            multiplayerButton.setScale(1);
        });

        multiplayerButton.on('pointerdown', () => {
            this.scene.start('Multiplayer');
        });


        const creatorText = this.add.text(centerX, 600, 'Made by: Vicente, Olivier', {
            fontFamily: 'Arial Black', 
            fontSize: 20, 
            color: '#ffffff',
            stroke: '#1a1a1a', 
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
    }
}
