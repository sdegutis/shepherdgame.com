import { A, LEFT, RIGHT, X } from "../lib/core.js";
import { Bubble } from "./bubble.js";
import { Entity, Interaction, Logic } from "./entity.js";

const XVEL = 1;
const XVELCAP = 2;
const YVEL = 0.5;
const YVELCAP = 7;

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

  override actOn = (player: Entity, x: number, y: number): Interaction => {
    if (this === player) return 'pass';
    if (x) return 'pass';
    if (y < 0) return 'pass';
    return 'stop';
  };

  override update = (t: number, logic: Logic) => {
    this.move(logic);

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

  move(logic: Logic) {
    this.tryMoveX(logic);
    this.tryMoveY(logic);
  }

  tryMoveX(logic: Logic) {
    let x1 = 0;
    if (this.gamepad) {
      if (this.gamepad.buttons[LEFT].pressed) { x1 = -1; }
      else if (this.gamepad.buttons[RIGHT].pressed) { x1 = 1; }
      else { [x1] = this.gamepad.axes; }
    }

    const movingx = ~~(x1 * 100) / 100;

    if (movingx) {
      // accel
      this.dir = Math.sign(movingx);
      this.xvel += x1 * XVEL;
      if (this.xvel > XVELCAP) this.xvel = XVELCAP;
      if (this.xvel < -XVELCAP) this.xvel = -XVELCAP;
    }
    else {
      // decel
      if (this.xvel > 0) {
        this.xvel -= XVEL;
        if (this.xvel < 0) this.xvel = 0;
      }
      else if (this.xvel < 0) {
        this.xvel += XVEL;
        if (this.xvel > 0) this.xvel = 0;
      }
    }

    if (this.xvel) {
      const dir = Math.sign(this.xvel);
      const max = Math.abs(this.xvel);
      for (let i = 0; i < max; i += 1) {
        if (!logic.tryMove(this, dir, 0)) {
          this.xvel = 0;
          break;
        }
      }
    }
  }

  tryMoveY(logic: Logic) {
    this.yvel += YVEL;
    if (this.yvel > YVELCAP) this.yvel = YVELCAP;

    if (this.yvel) {
      const dir = Math.sign(this.yvel);
      const max = Math.abs(this.yvel);
      let broke = false;
      for (let i = 0; i < max; i += 1) {
        if (!logic.tryMove(this, 0, dir)) {
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
