const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 640,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        preload,
        create,
        update
    },
    physics: {
        default: 'arcade',
        arcade: {
        }
    }
};

var game = new Phaser.Game(config);
let cat;
let asteroide;
let gameover;
let cursors;
var music;
var scoreText;
var score = 0;

function preload() {
    this.load.spritesheet('cat', '../img/cat.png', { frameWidth: 97, frameHeight: 59 });
    this.load.spritesheet('ground', '../img/ground.png', { frameWidth: 64, frameHeight: 64 });
    this.load.image('sky', '../img/sky.jpg');
    this.load.spritesheet('rainbow', '../img/rainbow.png', { frameWidth: 50, frameHeight: 54 });
    this.load.image('asteroide', '../img/asteroide.png');
    this.load.image('gameOver', '../img/game_over.png');
    this.load.audio('music', '../audio/Nyan Cat.mp3');
    this.load.audio('musicFin', '../audio/GameOver.mp3');
}

function create() {
    this.data.set('Puntos', 2000);
    music = this.sound.add('music', { volume: 0.1 });
    music.play({});
    this.anims.create({
        key: 'walk',
        frames: 'cat',
        frameRate: 18,
        repeat: -1
    });

    sky = this.add.tileSprite(0, 0, 1600, 556, 'sky').setOrigin(0, 0);
    let platforms = this.physics.add.staticGroup();
    for (var i = 0; i < 25; i++) {
        platforms.create(64 * i, 588, 'ground', 1);
    }

    var estela = this.add.particles('rainbow');
    cat = this.physics.add.sprite(400, 250, 'rainbow', 'cat').play('walk').setScale(1.5);
    cat.setCollideWorldBounds(true);
    estela.createEmitter({
        follow: cat
    });

    asteroide = this.physics.add.sprite(1300, Math.random() * 600, 'asteroide').setScale(.5);
    asteroide.setVelocityX(-500);
    scoreText = this.add.text(10, 10, 'Score: 0', { font: '72px Pristina', fill: '#D32F2F'});
    gameover = this.add.image(650, 300, 'gameOver').setScale(1);
    gameover.visible = false;

    this.physics.add.collider(cat, asteroide, fin, null, this);
    this.physics.add.collider(cat, platforms);
    cursors = this.input.keyboard.createCursorKeys();
}

function fin() {
    gameover.visible = true;
    this.scene.pause();
    music.stop({});
    music = this.sound.add('musicFin', { volume: 0.1 });
    music.play({});
    
}

function update() {
    sky.tilePositionX += 9;
    if (cursors.up.isDown) {
        cat.setVelocityY(-200);
    } else if (cursors.down.isDown) {
        cat.setVelocityY(200);
    } else if (cursors.right.isDown) {
        cat.setVelocityX(200);
    } else if (cursors.left.isDown) {
        cat.setVelocityX(-200);
    } else {
        cat.setVelocityX(0);
        cat.setVelocityY(0);
    }
    if (asteroide.x < 0) {
        var x = 1;
        if(score>=90){
            x = 2
        }
        asteroide = this.physics.add.sprite(1300, Math.random() * 600, 'asteroide').setScale(.5);
        asteroide.setVelocityX(-500 * x);
        this.physics.add.collider(cat, asteroide, fin, null, this);
        gameover = this.add.image(650, 300, 'gameOver').setScale(1);
        gameover.visible = false;
        score += 10;
        scoreText.setText('Score: '+score);
    }
}