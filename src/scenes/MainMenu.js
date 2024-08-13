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

        let isAnimationRunning = true;
        let tweens;
        let delay;

        function randomFloatTween() {
            if (!isAnimationRunning) { return }

            function getRandomOffset() {
                let offset;
                do {
                    offset = Phaser.Math.Between(-15, 15);
                } while (offset >= -5 && offset <= 5);
                return offset;
            }
            
            let randomX = getRandomOffset() * sensibility;
            let randomY = getRandomOffset() * sensibility;
            
        
            tweens = this.tweens.add({
                targets: background,
                x: background.x + randomX,  // move randomly left or right
                y: background.y + randomY,  // move randomly up or down
                duration: Phaser.Math.Between(600, 800), // random duration between 1 and 2 seconds
                yoyo: true,
                repeat: 0,
                ease: 'Sine.easeInOut',
                callbackScope: this,
                onComplete: () => {
                    delay = this.time.delayedCall(30, randomFloatTween, [], this);
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
        const settingsButton = this.add.image(this.windowWidth - 50 , 50, 'settings-button')
        .setInteractive()
        .setScale(0.1);
        
        settingsButton.on('pointerdown', () => {
            console.log('Settings-Button geklickt');
            
            const settingsWindow = this.add.graphics();
            settingsWindow.fillStyle(0x808080, 0.8);
            settingsWindow.fillRoundedRect(settingsButton.x - 200, settingsButton.y + 50, 200, 300, 8);
        
            const closeButton = this.add.text(settingsButton.x - 50, settingsButton.y + 55, 'Close', {
                fontFamily: 'Arial',
                fontSize: 15,
                color: '#ffffff',
                stroke: '#ff0000',
                strokeThickness: 4
            }).setInteractive();
        
            let musicIsChecked = true;
        
            const checkbox = this.add.rectangle(1030, 160, 20, 20, 0xffffff)
                .setStrokeStyle(2, 0x000000)
                .setInteractive();
        
            const checkboxLabel = this.add.text(870, 150, 'Background music', {
                fontFamily: 'Arial',
                fontSize: '15px',
                color: '#ffffff'
            });
        
            const checkmark = this.add.text(1022, 150, '✓', {
                fontFamily: 'Arial',
                fontSize: '20px',
                color: '#00ff00'
            }).setVisible(musicIsChecked);
        
            checkbox.on('pointerdown', () => {
                if (this.game.music) {
                    musicIsChecked = !musicIsChecked;
                    checkmark.setVisible(musicIsChecked);
        
                    if (musicIsChecked) {
                        this.game.music.resume();
                    } else {
                        this.game.music.pause();
                    }
                }
            });
        
            let animationIsChecked = true;
        
            const checkboxLabelAnimation = this.add.text(870, 200, 'Animation', {
                fontFamily: 'Arial',
                fontSize: '15px',
                color: '#ffffff'
            });
        
            const checkboxAnimation = this.add.rectangle(1030, 210, 20, 20, 0xffffff)
                .setStrokeStyle(2, 0x000000)
                .setInteractive();
        
            const checkmarkAnimation = this.add.text(1022, 200, '✓', {
                fontFamily: 'Arial',
                fontSize: '20px',
                color: '#00ff00'
            }).setVisible(animationIsChecked);
        
            checkboxAnimation.on('pointerdown', () => {
                isAnimationRunning = !isAnimationRunning;
                animationIsChecked = !animationIsChecked;
                checkmarkAnimation.setVisible(animationIsChecked);
        
                if (!isAnimationRunning && tweens) {
                    tweens.remove();
                    if (delay) {
                        delay.remove();
                        delay = null;
                    }
                } else {
                    randomFloatTween.call(this);
                }
            });
        
            closeButton.on('pointerdown', () => {
                closeButton.destroy();
                settingsWindow.destroy();
        
                checkboxLabel.destroy();
                checkbox.destroy();
                checkmark.destroy();
        
                checkboxLabelAnimation.destroy();
                checkboxAnimation.destroy();
                checkmarkAnimation.destroy();
            });
        });
        
        
        settingsButton.on('pointerover', () => {
            this.tweens.add({
                targets: settingsButton,
                angle: 100,
                duration: 400,
                ease: 'Power2',
            });
        });
        
        settingsButton.on('pointerout', () => {
            this.tweens.add({
                targets: settingsButton,
                angle: 0,
                duration: 400,
                ease: 'Power2',
            });
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


        this.add.text(centerX, 600, 'Made by: Vicente, Olivier', {
            fontFamily: 'Arial Black', 
            fontSize: 20, 
            color: '#ffffff',
            stroke: '#1a1a1a', 
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
    }
}
