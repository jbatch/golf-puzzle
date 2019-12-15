'use strict';

import 'phaser';
import Ball from './game-objects/ball';

const LEVELS = ['level_1_data', 'level_2_data', 'level_3_data'];

type SkipKey = [Phaser.Input.Keyboard.Key, number]
export default class GameScene extends Phaser.Scene {
  ball: Ball;
  goalTile: Phaser.Tilemaps.Tile;
  level: number;
  levelSkipKeys: Array<SkipKey>;

  constructor() {
    super('MainScene');
  }

  init(): void {}

  preload() {
    this.load.image('tilemap', './media/golf_puzzle_tileset_extruded.png');
    this.load.image('ball', './media/ball.png');
    this.load.image('aiming_guide', './media/aiming_guide.png');
    this.load.tilemapTiledJSON('level_1_data', './data/level_1.json');
    this.load.tilemapTiledJSON('level_2_data', './data/level_2.json');
    this.load.tilemapTiledJSON('level_3_data', './data/level_3.json');
  }

  create({ level }: { level: number }) {
    this.level = level || 0;
    this.initMap(LEVELS[this.level]);
    this.initColliders();
    this.cameras.main.startFollow(this.ball);

    // Keys to skip to levels
    this.levelSkipKeys = [
      [this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE), 0],
      [this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO), 1],
      [this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE), 2],
      [this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR), 3],
      [this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE), 4],
      [this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX), 5],
      [this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN),6],
      [this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT), 7],
      [this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NINE), 8],
      [this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO), 9]
    ];
  }

  initMap(levelKey: string) {
    const map = this.make.tilemap({ key: levelKey });
    const tileset = map.addTilesetImage(
      'golf_puzzle_tilemap',
      'tilemap',
      32,
      32,
      1,
      2
    );
    const backgroundLayer = map.createStaticLayer('background', tileset, 0, 0);
    const staticLayer = map.createStaticLayer('static', tileset, 0, 0);
    staticLayer.setCollisionByProperty({ collides: true });
    this.goalTile = staticLayer.filterTiles(
      (t: Phaser.Tilemaps.Tile) => t.properties.goal
    )[0];
    this.matter.world.convertTilemapLayer(staticLayer);
    this.matter.world.createDebugGraphic();

    this.ball = new Ball({ scene: this, x: 0, y: 0 });
    const ball = map.createFromObjects(
      'object',
      'ball_spawn_point',
      {},
      this
    )[0];
    console.assert(ball, `No ball spawn point in map ${levelKey}`);
    this.ball.setPosition(ball.x, ball.y);
    ball.destroy();
  }

  initColliders() {
    this.matter.world.setBounds(
      0,
      0,
      this.game.config.width as number,
      this.game.config.height as number
    );
  }

  update() {
    this.ball.update();
    for (var skipKey of this.levelSkipKeys) {
      const [key, level] = skipKey;
      if (Phaser.Input.Keyboard.JustDown(key)) {
        this.scene.restart({level});
      }
    }
    if (
      Phaser.Input.Keyboard.JustDown(
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE)
      )
    ) {
    }
  }
}
