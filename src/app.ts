'use strict';

import 'phaser';
import * as PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import GameScene from './js/game-scene';
import './assets/css/app.css';

var config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 960,
  height: 640,
  parent: 'main',
  scene: [GameScene],
  physics: {
    default: 'matter',
    matter: {
      gravity: { y: 0.5 },
      debug: true,
      // enableSleeping: true
    }
  },
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin, // The plugin class
        key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
        mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision
      }
    ]
  }
};

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.addEventListener('load', () => {
  const game = new Game(config);
});
