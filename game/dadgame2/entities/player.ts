import { A, LEFT, RIGHT, X } from "../lib/core.js";
import { PixelImage } from '../lib/image.js';
import { Bubble } from "./bubble.js";
import { BubbleWand } from "./bubblewand.js";
import { Entity, Interaction, Logic } from "./entity.js";
import { Wall } from "./wall.js";

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

  hasWand = false;
  wandPressed = 0;

  constructor(
    x: number,
    y: number,
    image: PixelImage,
    public gamepadIndex: number,
    public bubble: Bubble,
  ) {
    super(x, y, image);
  }

  override collideWith = (other: Entity, x: number, y: number): Interaction => {
    if (other instanceof Player) {
      if (x || y < 0 || this.y > other.y - 7) return 'pass';
      return 'stop';
    }

    if (other instanceof BubbleWand) {
      if (this.hasWand) return 'pass';
      this.hasWand = true;
      other.dead = true;
      return 'pass';
    }

    if (other instanceof Wall) {
      if (!other.jumpThrough) return 'stop';
      if (y <= 0) return 'pass';
      return (other.y === this.y + 7) ? 'stop' : 'pass';
    }

    if (other instanceof Bubble) {
      if (x) {
        if (other.aliveFor < 30) return 'pass';
        other.x += x;
        return 'pass';
      }

      if (y < 0) {
        if (other.aliveFor < 30) return 'pass';
        other.y -= 1;
        return 'pass';
      }
      else if (y > 0) {
        if (this.y > other.y - 6) {
          return 'pass';
        }

        // player.y -= 1;
        other.sitting = true;
        other.unsat = 1;
        other.image = other.flatImage;
        return 'stop';
      }

      return 'pass';
    }

    return 'pass';
  };

  override update = (t: number, logic: Logic) => {
    this.move(logic);

    if (this.gamepad?.buttons[A].pressed && this.stoodFor >= 1) {
      this.stoodFor = 0;
      this.yvel = -5.15;
    }

    this.maybeBlowBubble();

    // const dur = 10_000;
    // const h = t % dur / dur;

    // this.image.reset();
    // for (let i = 0; i < 8 * 8 * 4; i += 4) {
    //   const p = this.image.pixels;
    //   p[i + 0] = (p[i + 0] + h * 360) % 360;
    // }
  };

  maybeBlowBubble() {
    if (!this.hasWand) return;

    if (this.gamepad?.buttons[X].pressed) {
      this.wandPressed++;
    }
    else {
      this.wandPressed = 0;
      return;
    }

    if (this.wandPressed === 1) {
      this.bubble.reset(this.x + (8 * this.dir), this.y);
    }
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
