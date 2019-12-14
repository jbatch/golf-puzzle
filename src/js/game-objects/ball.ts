'use strict';

import 'phaser';
import AimingGuide from './aiming_guide';
import PowerSlider from './power-slider';

type Props = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture?: string;
  frame?: string | integer;
};

export default class Ball extends Phaser.Physics.Matter.Image {
  private curserKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private actionKey: Phaser.Input.Keyboard.Key;
  private ballState: string;
  aimingGuide: AimingGuide;
  powerSlider: PowerSlider;
  angle: number;
  power: number;

  constructor({ scene, x, y, texture, frame }: Props) {
    super(scene.matter.world, x, y, texture || 'ball', frame);
    this.curserKeys = this.scene.input.keyboard.createCursorKeys();
    this.actionKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.ballState = 'idle';
    this.scene.matter.world.add(this);
    this.setCircle(8,{restitution: 0.9, friction: 0});
    this.setIgnoreGravity(false);
    this.setScale(1);
    
    this.scene.add.existing(this);
  }

  startAiming() {
    this.ballState = 'aiming';
    this.aimingGuide = new AimingGuide({
      scene: this.scene,
      x: this.x,
      y: this.y
    });
  }

  stopAiming() {
    this.angle = this.aimingGuide.angle;
    // this.aimingGuide.destroy();
    this.ballState = 'power';
  }

  startPower() {
    this.powerSlider = new PowerSlider({
      scene: this.scene,
      x: this.x + 10,
      y: this.y - 20
    });
  }

  stopPower() {
    this.power = this.powerSlider.stop();
    this.powerSlider.destroy();
    this.aimingGuide.destroy();
    this.ballState = 'moving';
    console.log('angle', this.angle, 'power', this.power);
  }

  hitBall() {
    this.setVelocityX(Math.cos(Phaser.Math.DegToRad(this.angle)) * this.power / 5);
    this.setVelocityY(Math.sin(Phaser.Math.DegToRad(this.angle)) * this.power / 5);
  }

  ballStopped() {
    console.log('stopped')
    this.setVelocity(0,0);
    this.ballState = 'idle';
  }

  update() {
    if (this.curserKeys.left.isDown) {
      if (this.ballState === 'aiming') {
        this.aimingGuide.decreaseAngle();
      }
    }
    if (this.curserKeys.right.isDown) {
      if (this.ballState === 'aiming') {
        this.aimingGuide.increaseAngle();
      }
    }
    if (Phaser.Input.Keyboard.JustDown(this.actionKey)) {
      if (this.ballState === 'idle') {
        this.startAiming();
        return;
      }
      if (this.ballState === 'aiming') {
        this.stopAiming();
        this.startPower();
        return;
      }
      if (this.ballState === 'power') {
        this.stopPower();
        this.hitBall();
        return;
      }
    }
    if (this.ballState === 'power') {
      this.powerSlider.update();
    }
    if(this.ballState === 'moving') {
      // console.log((this.body as any).speed);
      // console.log(this.body as any).speed)
      if((this.body as any).speed < 0.2) {
        this.ballStopped();
      }
    }
  }
}
