'use strict'

import 'phaser';

type Props = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture?: string;
  frame?: string | integer;
};

export default class Ball extends Phaser.GameObjects.Image {
  
  constructor({scene, x, y, texture, frame}: Props) {
    super(scene, x, y, texture || 'ball', frame);
    this.scene.physics.world.enable(this);
    var body = this.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(true);
    body.setCircle(8);
    body.setOffset(9);
    this.setScale(1);
    this.scene.add.existing(this);
  }
}