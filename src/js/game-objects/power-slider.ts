'use strict';

import 'phaser';

type Props = {
  scene: Phaser.Scene;
  x: number;
  y: number;
};

const MAX_POWER = 100;

export default class PowerSlider extends Phaser.GameObjects.Rectangle {
  power: number;
  powerChange: number;
  fillRectangle: Phaser.GameObjects.Rectangle;

  constructor({ scene, x, y }: Props) {
    super(scene, x, y, 20, 60, 0x000000, 1);
    this.setOrigin(0, 1).setStrokeStyle(2, 0xffffff, 1);
    this.powerChange = 1;

    this.fillRectangle = new Phaser.GameObjects.Rectangle(
      scene,
      x,
      y,
      20,
      0,
      0x00ff00,
      1
    );
    this.fillRectangle.setOrigin(0, 1);

    this.power = 0;
    this.scene.add.existing(this);
    this.scene.add.existing(this.fillRectangle);
  }

  stop() {
    this.fillRectangle.destroy();
    return this.power;
  }

  update() {
    this.power += this.powerChange;
    if (this.power >= MAX_POWER) {
      this.power = MAX_POWER;
      this.powerChange = -1 * this.powerChange;
    }
    if (this.power <= 0) {
      this.power = 0;
      this.powerChange = -1 * this.powerChange;
    }

    this.fillRectangle.height = this.height * (this.power / 100) * -1;
  }
}
