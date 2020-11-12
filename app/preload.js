window.addEventListener('DOMContentLoaded', () => {
    require('./phaser.min.js');
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    new Phaser.Game(config);

    let platforms;
    let player;
    let enemy;
    let stars;
    let score = 0;
    let scoreText;
    let death = 0;
    let deathText;
    let bombs;

    function preload ()
    {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }


    function create ()
    {
        this.add.image(400, 300, 'sky');

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        player = this.physics.add.sprite(100, 450, 'dude');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        player.body.setGravityY(300);

        platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');
        this.physics.add.collider(player, platforms);

        enemy = this.physics.add.sprite(100, 450, 'dude');
        enemy.setBounce(0.2);
        enemy.setTint(0xff0000);
        enemy.setCollideWorldBounds(true);
        enemy.body.setGravityY(300)
        enemy.setPosition(300, 200);
        enemy.setVelocityX(-160);
        this.physics.add.collider(enemy, platforms);
        this.physics.add.overlap(player, enemy, hitEnemyObject);

        stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(stars, platforms);
        this.physics.add.overlap(player, stars, collectStar, null, this);

        scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000', fontStyle: 'bold' });
        deathText = this.add.text(600, 16, 'Death: 0', { fontSize: '32px', fill: '#000', fontStyle: 'bold' });

        bombs = this.physics.add.group();
        this.physics.add.collider(bombs, platforms);
        this.physics.add.collider(player, bombs, hitEnemyObject, null, this);
        player.setPosition(200, 400);
    }

    function update ()
    {
        let cursors = this.input.keyboard.createCursorKeys();
        if (cursors.left.isDown)
        {
            player.setVelocityX(-160);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(160);

            player.anims.play('right', true);
        }
        else
        {
            player.setVelocityX(0);

            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down)
        {
            player.setVelocityY(-480);
        }

        moveEnemy();
    }

    function collectStar (player, star)
    {
        star.disableBody(true, true);

        score += 10;
        scoreText.setText('Score: ' + score);

        if (stars.countActive(true) === 0)
        {
            stars.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);

            });

            let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            let bomb = bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

        }
    }

    function hitEnemyObject (player)
    {
        death++;
        deathText.setText("Death: " + death);
        player.setPosition(200, 400);
    }

    function moveEnemy() {
        if (enemy.x <= 17) {
            enemy.setVelocityX(160);
        } else if (enemy.x > 600){
            enemy.setVelocityX(-160);
        }

        if (enemy.body.velocity.x > 0) {
            enemy.anims.play('right', true);
        } else if (enemy.body.velocity.x < 0){
            enemy.anims.play('left', true);
        } else {
            enemy.anims.play('turn', true);
        }
    }
});