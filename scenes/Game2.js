export default class Game2 extends Phaser.Scene {
  constructor() {
    super("Game2");
  }

  init(data) {
    this.score = data.score || 0; // opcional: pasar puntaje
  }

  preload() {
    this.load.tilemapTiledJSON("map2", "public/assets/tilemap/map2.json");
    this.load.image("tileset", "public/assets/texture.png");
    this.load.image("star", "public/assets/star.png");
    this.load.image("meta", "public/assets/bomb.png");

    this.load.spritesheet("dude", "./public/assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    const map = this.make.tilemap({ key: "map2" });

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const tileset = map.addTilesetImage("tileset", "tileset");

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const belowLayer = map.createLayer("Fondo", tileset, 0, 0);
    const platformLayer = map.createLayer("Plataformas", tileset, 0, 0);
    const objectsLayer = map.getObjectLayer("Objetos");

    // Find in the Object Layer, the name "dude" and get position
    const spawnPoint = map.findObject(
      "Objetos",
      (obj) => obj.name === "player"
    );
    console.log("spawnPoint", spawnPoint);

    this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "dude");

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.player.body.setAllowGravity(false);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    platformLayer.setCollisionByProperty({ esColisionable: true });
    this.physics.add.collider(this.player, platformLayer);

    // tiles marked as colliding
    /*
    const debugGraphics = this.add.graphics().setAlpha(0.75);
    platformLayer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    });
    */

    // Create empty group of starts
    this.stars = this.physics.add.group();

    // find object layer
    // if type is "stars", add to stars group
    objectsLayer.objects.forEach((objData) => {
      console.log(objData);
      const { x = 0, y = 0, name, type } = objData;
      switch (type) {
        case "star": {
          // add star to scene
          // console.log("estrella agregada: ", x, y);
          const star = this.stars.create(x, y, "star");
          star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
          break;
        }
        case "goal": {
          this.goal = this.physics.add.sprite(x, y, "meta");
          break;
        }
      }
    });

    // add collision between player and stars
    this.physics.add.collider(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );
    // add overlap between stars and platform layer
    this.physics.add.collider(this.stars, platformLayer);

    this.scoreText = this.add.text(16, 16, `objetos: ${this.score} de 10`, {
      fontSize: "32px",
      fill: "#000",
    });
    this.physics.add.overlap(
      this.player,
      this.goal,
      this.reachGoal,
      null,
      this
    );
    this.totalStars = objectsLayer.objects.filter(o => o.type === "star").length;
  }

  update() {
    this.player.setVelocity(0);
    const speed = 160;
    // update game objects
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.anims.play("left", true);
    }   else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);

      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play("turn");
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
    }
  }
  collectStar(player, star) {
    star.disableBody(true, true);

    this.score += 1;
    this.scoreText.setText(`objetos: ${this.score} de 10`);
  }
  reachGoal(player, goal) {
    if (this.score >= 10) {
      this.scene.start("Game3", { score: this.score });
    }
  }
}