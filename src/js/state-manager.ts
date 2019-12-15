'use strict';

var instance: StateManager;

export class StateManager {
  level: number
  constructor() {
    console.assert(
      instance === undefined,
      'Trying to instantiate non-Singleton StateManager'
    );
    this.level = 0;
  }

  static getInstance() {
    if (instance === undefined) {
      instance = new StateManager();
    }
    return instance;
  }
}
