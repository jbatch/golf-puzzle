'use strict';

import 'phaser';
import Ball from './game-objects/ball';

export default class GameScene extends Phaser.Scene {
  ball: Ball;

  constructor() {
    super('MainScene');
  }

  init(): void {}

  preload() {
    this.load.image('tilemap', './media/golf_puzzle_tileset.png');
    this.load.image('ball', './media/ball.png');
    this.load.tilemapTiledJSON('level_1_data', './data/level_1.json');
  }

  create() {
    this.ball = new Ball({ scene: this, x: 0, y: 0 });
    this.initMap('level_1_data');
    this.initColliders();
    this.cameras.main.startFollow(this.ball);
  }

  initMap(levelKey: string) {
    const map = this.make.tilemap({ key: levelKey });
    const tileset = map.addTilesetImage('golf_puzzle_tilemap', 'tilemap');
    const staticLayer = map.createStaticLayer('static', tileset, 0, 0);
    staticLayer.setCollisionByProperty({ collides: true });

    const ball = map.createFromObjects(
      'object',
      'ball_spawn_point',
      {},
      this
    )[0];
    console.assert(ball, `No ball spawn point in map ${levelKey}`);
    this.ball.setPosition(ball.x, ball.y);
    ball.destroy()

    this.physics.add.collider(this.ball, staticLayer);
  }

  initColliders() {}

  update() {}
}
