import { A, LEFT, RIGHT, X } from "../lib/core.js";
import { entities } from "../lib/data.js";
import { Bubble } from "./bubble.js";
import { Entity } from "./entity.js";


function intersects(a: Entity, b: Entity) {
  return (
    a.x + 7 >= b.x &&
    a.y + 7 >= b.y &&
    a.x <= b.x + 7 &&
    a.y <= b.y + 7
  );
}

export class Player extends Entity {

  get gamepad() { return navigator.getGamepads()[this.gamepadIndex]; }

  xvel = 0;
  yvel = 0;
  dir = 1;

  stoodFor = 0;

  hasWand = true;

  constructor(
    x: number,
    y: number,
    image: OffscreenCanvas,
    public gamepadIndex: number,
    public bubble: Bubble,
  ) {
    super(x, y, image);
  }

  override actOn = (player: Player, x: number, y: number): boolean => {
    if (this === player) return true;
    if (x) return true;
    if (y < 0) return true;
    return false;
  };

  override update = (t: number) => {
    this.move();

    if (this.gamepad?.buttons[A].pressed && this.stoodFor >= 1) {
      this.stoodFor = 0;
      this.yvel = -5.15;
    }

    if (this.hasWand && this.gamepad?.buttons[X].pressed) {
      this.blowBubble();
    }
  };

  blowBubble() {
    this.bubble.reset(this.x + (8 * this.dir), this.y);
  }

  move() {
    let x1 = 0;
    if (this.gamepad) {
      if (this.gamepad.buttons[LEFT].pressed) { x1 = -1; }
      else if (this.gamepad.buttons[RIGHT].pressed) { x1 = 1; }
      else { [x1] = this.gamepad.axes; }
    }

    const movingx = ~~(x1 * 100) / 100;
    const xspeed = 1;
    const xmaxspeed = 2;

    if (movingx) {
      // accel
      this.dir = Math.sign(movingx);
      this.xvel += x1 * xspeed;
      if (this.xvel > xmaxspeed) this.xvel = xmaxspeed;
      if (this.xvel < -xmaxspeed) this.xvel = -xmaxspeed;
    }
    else {
      // decel
      if (this.xvel > 0) {
        this.xvel -= xspeed;
        if (this.xvel < 0) this.xvel = 0;
      }
      else if (this.xvel < 0) {
        this.xvel += xspeed;
        if (this.xvel > 0) this.xvel = 0;
      }
    }

    if (this.xvel) {
      const dir = Math.sign(this.xvel);
      const max = Math.abs(this.xvel);
      for (let i = 0; i < max; i += 1) {
        this.x += dir;
        const touching = entities.filter(a => intersects(a, this));
        if (!touching.every(a => (!a.dead && a.actOn) ? a.actOn(this, dir, 0) : true)) {
          this.x -= dir;
          this.xvel = 0;
          break;
        }
      }
    }

    const yspeed = 0.5;
    const ymaxspeed = 7;

    this.yvel += yspeed;
    if (this.yvel > ymaxspeed) this.yvel = ymaxspeed;

    if (this.yvel) {
      const dir = Math.sign(this.yvel);
      const max = Math.abs(this.yvel);
      let broke = false;
      for (let i = 0; i < max; i += 1) {
        this.y += dir;
        const touching = entities.filter(a => intersects(a, this));
        if (!touching.every(a => (!a.dead && a.actOn) ? a.actOn(this, 0, dir) : true)) {
          this.y -= dir;

          if (this.yvel > 0) {
            this.stoodFor++;
          }

          this.yvel = 0;
          broke = true;
          break;
        }
      }
      if (!broke && this.yvel > 0) {
        this.stoodFor = 0;
      }
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
