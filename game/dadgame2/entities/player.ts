import { B, X } from "../lib/core.js";
import { actables, players, Updatable } from "../lib/data.js";
import { intersects } from "../lib/helpers.js";
import { Entity } from "./entity.js";

export class Player implements Updatable {

  gamepadIndex = players.length;
  get gamepad() { return navigator.getGamepads()[this.gamepadIndex]; }

  constructor(public entity: Entity) {
  }

  update(t: number) {
    this.move();

    if (this.gamepad?.buttons[X].pressed) {
    }
  }

  move() {
    if (!this.gamepad) return;
    const [x1, y1] = this.gamepad.axes;

    const speed = this.gamepad.buttons[B].pressed ? 2 : 1;

    const xAdd = x1 * speed;
    const yAdd = y1 * speed;

    this.entity.x += xAdd;
    if (!actables.filter(a => intersects(a.entity, this.entity)).every(a => a.actOn(this, xAdd, 0))) {
      this.entity.x -= xAdd;
    }

    this.entity.y += yAdd;
    if (!actables.filter(a => intersects(a.entity, this.entity)).every(a => a.actOn(this, 0, yAdd))) {
      this.entity.y -= yAdd;
    }
  }

  rumble(sec: number, weak: number, strong: number) {
    // this.gamepad!.vibrationActuator.playEffect("dual-rumble", {
    //   startDelay: 0,
    //   duration: sec * 1000,
    //   weakMagnitude: weak,
    //   strongMagnitude: strong,
    // });
  }

}
