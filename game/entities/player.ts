import { Camera } from "../lib/camera.js";
import { A } from "../lib/core.js";
import { actables, players, Updatable } from "../lib/data.js";
import { intersects } from "../lib/helpers.js";
import { Entity } from "./entity.js";

export class Player implements Updatable {

  gamepadIndex = players.length;
  get gamepad() { return navigator.getGamepads()[this.gamepadIndex]; }

  keys = 0;
  bombs = 0;
  yvel = 0;

  constructor(public entity: Entity, private camera: Camera) {
    entity.ox = 2;
    entity.oy = 1;
    entity.w = 4;
    entity.h = 7;
    entity.x += entity.ox;
    entity.y += entity.oy;
  }

  update() {
    if (!this.gamepad) return;
    const [x1] = this.gamepad.axes;

    const speed = 1;

    const xAdd = x1 * speed;

    const MAX = 2;
    const GRAV = 0.2;

    this.yvel += GRAV;
    if (this.yvel > MAX) this.yvel = MAX;

    const yAdd = this.yvel;

    let found;

    this.entity.x += xAdd;
    found = actables.find(a => intersects(a.entity, this.entity));
    if (found && !found.actOn(this)) {
      this.entity.x -= xAdd;
    } else {
      this.camera.update();
    }

    this.entity.y += yAdd;
    found = actables.find(a => intersects(a.entity, this.entity));
    if (found && !found.actOn(this)) {
      this.entity.y -= yAdd;

      const standing = (yAdd > 0);
      if (standing && this.gamepad.buttons[A].pressed) {
        this.yvel = -MAX;
      }
    } else {
      this.camera.update();
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
