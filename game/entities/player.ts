import { Camera } from "../lib/camera.js";
import { A } from "../lib/core.js";
import { actables, players, Updatable } from "../lib/data.js";
import { intersects } from "../lib/helpers.js";
import { Entity } from "./entity.js";

export class Player implements Updatable {

  private _gamepadIndex = players.length;
  public get gamepadIndex() {
    return this._gamepadIndex;
  }
  public set gamepadIndex(value) {
    this._gamepadIndex = value;
  }
  get gamepad() { return navigator.getGamepads()[this.gamepadIndex]; }

  keys = 0;

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
    const yAdd = (this.gamepad.buttons[A].pressed ? -1 : 1) * speed;

    let found;

    this.entity.x += xAdd;
    found = actables.find(a => intersects(a.entity, this.entity));
    if (found && !found.actOn(this)) this.entity.x -= xAdd; else this.camera.update();

    this.entity.y += yAdd;
    found = actables.find(a => intersects(a.entity, this.entity));
    if (found && !found.actOn(this)) this.entity.y -= yAdd; else this.camera.update();
  }

  rumble(sec: number, weak: number, strong: number) {
    this.gamepad!.vibrationActuator.playEffect("dual-rumble", {
      startDelay: 0,
      duration: sec * 1000,
      weakMagnitude: weak,
      strongMagnitude: strong,
    });
  }

}
