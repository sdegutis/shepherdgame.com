import { B, X } from "../lib/core.js";
import { actables, players, Updatable } from "../lib/data.js";
import { intersects } from "../lib/helpers.js";
import { Entity } from "./entity.js";

export class Player implements Updatable {

  gamepadIndex = players.length;
  get gamepad() { return navigator.getGamepads()[this.gamepadIndex]; }

  keys = 0;
  bombs = 0;

  get isGreen() { return this.gamepadIndex === 0 }
  get isPink() { return this.gamepadIndex === 2 }
  get isPurple() { return this.gamepadIndex === 1 }

  constructor(public entity: Entity) {
    entity.ox = 2;
    entity.oy = 1;
    entity.w = 4;
    entity.h = 7;
    entity.x += entity.ox;
    entity.y += entity.oy;
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

    let found;

    this.entity.x += xAdd;
    found = actables.find(a => intersects(a.entity, this.entity));
    if (found && !found.actOn(this, xAdd, 0)) {
      this.entity.x -= xAdd;
    }

    this.entity.y += yAdd;
    found = actables.find(a => intersects(a.entity, this.entity));
    if (found && !found.actOn(this, 0, yAdd)) {
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
