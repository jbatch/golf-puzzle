'use strict'

import 'phaser';

type Props = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture?: string;
  frame?: string | integer;
};

const TURN_SPEED = 3;

export default class AimingGuide extends Phaser.GameObjects.Image {
  
  angle: number;
  constructor({scene, x, y, texture, frame}: Props) {
    super(scene, x, y, texture || 'aiming_guide', frame);
    this.angle = -90; // Start point staright up
    this.setOrigin(0,0)
    this.setRotation(Phaser.Math.DegToRad(this.angle));
    this.scene.add.existing(this);
  }

  increaseAngle() {
    this.angle += TURN_SPEED;
  }

  decreaseAngle() {
    this.angle -= TURN_SPEED;
  }
}