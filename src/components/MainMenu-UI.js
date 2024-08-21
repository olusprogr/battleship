
const windowsWidth = window.innerWidth
const windowsHeight = window.innerHeight
let mobile = false;

const centerX = windowsWidth / 2;
const centerY = windowsHeight / 2;
let sensibility = 1;

let heightOfBackground = 700;
if (windowsWidth < 768) {
    mobile = true;
    heightOfBackground = 300;
    sensibility = 0.5;
}

let isAnimationRunning = true;
let settingsButtonCliked = false;
let tweens;
let delay;

let background;


export function titleText(scene) {
    const title = scene.add.text(centerX, 200, 'War Ship', {
        fontFamily: 'Arial Black', 
        fontSize: Math.min(windowsWidth * 0.15, 80), 
        color: '#ffffff',
        stroke: '#000000', 
        strokeThickness: 8,
        align: 'center'
    }).setOrigin(0.5);

    title.setShadow(5, 5, '#1a1a1a', 5, true, true);

    return title;
}

export function addImage(scene) {
    background = scene.add.image(512, 484, 'war-ship');
    return background;
}

export function madeBy(scene) {
    return scene.add.text(centerX, 600, 'Made by: Vicente, Olivier', {
        fontFamily: 'Arial Black', 
        fontSize: 20, 
        color: '#ffffff',
        stroke: '#1a1a1a', 
        strokeThickness: 8,
        align: 'center'
    }).setOrigin(0.5);
}

export function multiplayerButton(scene) {
    const multiplayerButton = scene.add.text(centerX, 450, 'Multiplayer (Not available yet)', {
        fontFamily: 'Arial',
        fontSize: Math.min(windowsWidth * 0.05, 32), 
        color: '#cccccc',
        stroke: '#000000',
        strokeThickness: 4
    }).setOrigin(0.5).setInteractive();

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
}

export function singleplayerButton(scene) {
    const singleplayerButton = scene.add.text(centerX, 350, 'Singleplayer', {
        fontFamily: 'Arial',
        fontSize: Math.min(windowsWidth * 0.05, 32),
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
        scene.scene.start('Singleplayer');
    });
}

export function randomFloatTween(scene) {
    function action() {
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
        
    
        tweens = scene.tweens.add({
            targets: background,
            x: background.x + randomX,
            y: background.y + randomY,
            duration: Phaser.Math.Between(600, 800),
            yoyo: true,
            repeat: 0,
            ease: 'Sine.easeInOut',
            callbackScope: scene,
            onComplete: () => {
                delay = this.time.delayedCall(30, randomFloatTween, [], this);
            },
        });
    }

    action.call(scene);
}

export function settingsButtonAndFunctionality(scene) {
    const settingsButton = scene.add.image(windowsWidth - 50 , 50, 'settings-button')
    .setInteractive()
    .setScale(0.1);

    let settingsButtonX = settingsButton.x - 200;
    let settingsButtonY = settingsButton.y + 50;

    let settingsWindowX = 200;
    let settingsWindowY = 300;

    settingsButton.on('pointerdown', () => {
        if (settingsButtonCliked) { return }
        settingsButtonCliked = true;
        
        const settingsWindow = scene.add.graphics();
        settingsWindow.fillStyle(0x808080, 0.8);
        settingsWindow.fillRoundedRect(settingsButtonX, settingsButtonY, settingsWindowX, settingsWindowY, 8);

        console.log(settingsButton.x, settingsButton.y);
    
        const closeButton = scene.add.text(settingsButton.x - 50, settingsButton.y + 55, 'Close', {
            fontFamily: 'Arial',
            fontSize: 15,
            color: '#ffffff',
            stroke: '#ff0000',
            strokeThickness: 4
        }).setInteractive();
    
        let musicIsChecked = true;
    
        const checkbox = scene.add.rectangle(1030, 160, 20, 20, 0xffffff)
            .setStrokeStyle(2, 0x000000)
            .setInteractive();
    
        const checkboxLabel = scene.add.text(870, 150, 'Background music', {
            fontFamily: 'Arial',
            fontSize: '15px',
            color: '#ffffff'
        });
    
        const checkmark = scene.add.text(1022, 150, '✓', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#00ff00'
        }).setVisible(musicIsChecked);
    
        checkbox.on('pointerdown', () => {
            if (scene.game.music) {
                musicIsChecked = !musicIsChecked;
                checkmark.setVisible(musicIsChecked);
    
                if (musicIsChecked) {
                    scene.game.music.resume();
                } else {
                    scene.game.music.pause();
                }
            }
        });
    
        let animationIsChecked = true;
    
        const checkboxLabelAnimation = scene.add.text(870, 200, 'Animation', {
            fontFamily: 'Arial',
            fontSize: '15px',
            color: '#ffffff'
        });
    
        const checkboxAnimation = scene.add.rectangle(1030, 210, 20, 20, 0xffffff)
            .setStrokeStyle(2, 0x000000)
            .setInteractive();
    
        const checkmarkAnimation = scene.add.text(1022, 200, '✓', {
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
                randomFloatTween.call(scene);
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

        settingsButton.on('pointerover', () => {
            scene.tweens.add({
                targets: settingsButton,
                angle: 100,
                duration: 400,
                ease: 'Power2',
            });
        });
        
        settingsButton.on('pointerout', () => {
            scene.tweens.add({
                targets: settingsButton,
                angle: 0,
                duration: 400,
                ease: 'Power2',
            });
        });
    });
}
