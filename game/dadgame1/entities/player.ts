import { Camera } from "../lib/camera.js";
import { A, B, X } from "../lib/core.js";
import { actables, drawables, players, Updatable, updatables } from "../lib/data.js";
import { intersects } from "../lib/helpers.js";
import { Sprite } from "../lib/pico8.js";
import { Entity } from "./entity.js";
import { RealBomb } from "./realbomb.js";

export class Player implements Updatable {

  gamepadIndex = players.length;
  get gamepad() { return navigator.getGamepads()[this.gamepadIndex]; }

  keys = 0;
  bombs = 0;

  get isGreen() { return this.gamepadIndex === 0 }
  get isPink() { return this.gamepadIndex === 2 }
  get isPurple() { return this.gamepadIndex === 1 }

  constructor(public entity: Entity, private camera: Camera, private bomb: Sprite) {
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
      this.placeBomb(t);
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
    } else {
      this.camera.update();
    }

    this.entity.y += yAdd;
    found = actables.find(a => intersects(a.entity, this.entity));
    if (found && !found.actOn(this, 0, yAdd)) {
      this.entity.y -= yAdd;
    } else {
      this.camera.update();
    }
  }

  placeBomb(t: number) {
    if (this.bombs === 0) return;
    this.bombs--;

    const entity = new Entity(6, this.entity.x, this.entity.y, this.bomb.image);
    const bomb = new RealBomb(entity, t);
    updatables.push(bomb);
    drawables.push(bomb.entity);
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
