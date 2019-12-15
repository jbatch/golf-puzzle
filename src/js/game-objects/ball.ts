'use strict';

import 'phaser';
import AimingGuide from './aiming_guide';
import PowerSlider from './power-slider';
import { StateManager } from '../state-manager';

type Props = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture?: string;
  frame?: string | integer;
};

export default class Ball extends Phaser.Physics.Matter.Image {
  private stateManager: StateManager;
  private curserKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private actionKey: Phaser.Input.Keyboard.Key;
  private ballState: string;
  private sensor: any;
  private sleepCounter: number;
  aimingGuide: AimingGuide;
  powerSlider: PowerSlider;
  aimAngle: number;
  power: number;
  touching: { down: string };

  constructor({ scene, x, y, texture, frame }: Props) {
    super(scene.matter.world, x, y, texture || 'ball', frame);
    this.stateManager = StateManager.getInstance();
    this.curserKeys = this.scene.input.keyboard.createCursorKeys();
    this.actionKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.ballState = 'idle';
    this.touching = { down: 'nothing' };
    this.scene.matter.world.add(this);
    // const { Body, Bodies } = Phaser.Physics.Matter
    const Bodies = this.scene.matter.bodies as any;
    const Body = this.scene.matter.body as any;
    const mainBody = Bodies.circle(this.x + 6, this.y + 0, 8);
    this.sensor = Bodies.rectangle(this.x + 6, this.y, 10, 30, {
      isSensor: true
    });
    this.sleepCounter = 0;
    const body = Body.create({
      parts: [mainBody, this.sensor],
      restitution: 0.9,
      friction: 0
    });
    this.setExistingBody(body);
    this.scene.matter.world.on('beforeupdate', this.resetTouching, this);
    const MatterCollision = (this.scene as any).matterCollision;
    MatterCollision.addOnCollideStart({
      objectA: this.sensor,
      callback: this.onSensorCollide,
      context: this
    });
    MatterCollision.addOnCollideActive({
      objectA: this.sensor,
      callback: this.onSensorCollide,
      context: this
    });

    this.setAngularVelocity(0);
    this.setIgnoreGravity(false);
    this.setScale(1);

    this.scene.add.existing(this);
  }

  resetTouching() {
    this.touching = { down: 'nothing' };
  }

  onSensorCollide({ bodyA, bodyB }) {
    if (bodyB.isSensor) return;
    const go = (bodyB as any).gameObject;
    if (go && go.tile && go.tile.properties.goal) {
      this.touching.down = 'goal';
    } else {
      this.touching.down = 'ground';
    }
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
    this.aimAngle = this.aimingGuide.angle;
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
    this.setSleepEndEvent(true);
    this.setVelocityX(
      (Math.cos(Phaser.Math.DegToRad(this.aimAngle)) * this.power) / 5
    );
    this.setVelocityY(
      (Math.sin(Phaser.Math.DegToRad(this.aimAngle)) * this.power) / 5
    );
  }

  ballStopped() {
    console.log('stopped');
    this.setVelocity(0, 0);
    this.ballState = 'idle';
    if (this.touching.down === 'goal') {
      this.ballState = 'finished';
      this.nextLevel();
    }
  }

  nextLevel() {
    this.stateManager.level += 1;
    this.scene.scene.restart({ level: this.stateManager.level });
  }

  updateSleepCounter() {
    if ((this.body as any).speed < 0.2) {
      this.sleepCounter++;
    } else {
      this.sleepCounter = 0;
    }
  }

  update() {
    this.setAngularVelocity(0);
    this.updateSleepCounter();
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
    if (this.ballState === 'moving') {
      if (this.sleepCounter > 30) {
        this.ballStopped();
      }
    }
  }
}
