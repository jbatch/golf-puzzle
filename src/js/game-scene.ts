'use strict';

import 'phaser';
import Ball from './game-objects/ball';
import AimingGuide from './game-objects/aiming_guide';

export default class GameScene extends Phaser.Scene {
  ball: Ball;

  constructor() {
    super('MainScene');
  }

  init(): void {}

  preload() {
    this.load.image('tilemap', './media/golf_puzzle_tileset_extruded.png');
    this.load.image('ball', './media/ball.png');
    this.load.image('aiming_guide', './media/aiming_guide.png');
    this.load.tilemapTiledJSON('level_1_data', './data/level_1.json');
  }

  create() {
    this.initMap('level_1_data');
    this.initColliders();
    this.cameras.main.startFollow(this.ball);
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
  }
}
