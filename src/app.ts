'use strict';

import 'phaser';
import GameScene from './js/game-scene';
import './assets/css/app.css';
import { Utils } from './js/utils';

var config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 960,
  height: 640,
  parent: 'main',
  scene: [GameScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      debug: false
    }
  }
};

export class Game extends Phaser.Game {
  public utils: Utils;
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
    this.utils = new Utils({ game: this });
  }
}

window.addEventListener('load', () => {
  const game = new Game(config);
});
