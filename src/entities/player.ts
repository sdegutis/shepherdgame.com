import { Img } from "../lib/image.js";
import { game } from "../main.js";
import { Entity } from "./entity.js";

export class Player extends Entity {

  override layer = 1;

  constructor(
    x: number,
    y: number,
    spritesheet: number[],
    spriteIndex: number,
    private playerNum: number,
  ) {
    super(x, y, Img.from(spritesheet, spriteIndex));
    game.players[playerNum] = this;
  }

  override draw(layer: number): void {
    super.draw(layer);

    if (layer === 2) {
      const cx = Math.round(this.x + (this.image.w / 2) - game.camera.x);
      const cy = Math.round(this.y + (this.image.h / 2) - game.camera.y);

      for (let x = -10; x < 10; x++) {
        for (let y = -10; y < 10; y++) {
          const d = Math.sqrt((x ** 2) + (y ** 2));
          if (d < 10) {
            const i = (cy + y) * 320 * 4 + (cx + x) * 4;
            game.pixels[i + 3] = 255;
          }
        }
      }
    }
  }

}



// import { A, LEFT, RIGHT, X } from "../lib/crt.js";
// import { PixelImage } from '../lib/image.js';
// import { Entity, Interaction, Logic } from "./entity.js";
// import { Wall } from "./wall.js";

// const XVEL = 1;
// const XVELCAP = 2;
// const YVEL = 0.5;
// const YVELCAP = 7;

// export class Player extends Entity {

//   get gamepad() { return navigator.getGamepads()[this.gamepadIndex]; }

//   xvel = 0;
//   yvel = 0;
//   dir = 1;

//   constructor(
//     x: number,
//     y: number,
//     image: PixelImage,
//     public gamepadIndex: number,
//   ) {
//     super(x, y, image);
//   }

//   override collideWith = (other: Entity, x: number, y: number): Interaction => {
//     if (other instanceof Player) {
//       return 'stop';
//     }

//     if (other instanceof Wall) {
//       return 'pass';
//     }

//     return 'pass';
//   };

//   override update = (t: number) => {
//     this.move();
//   };

//   move(logic: Logic) {
//     this.tryMoveX();
//     this.tryMoveY();
//   }

//   tryMoveX() {
//     let x1 = 0;
//     if (this.gamepad) {
//       if (this.gamepad.buttons[LEFT].pressed) { x1 = -1; }
//       else if (this.gamepad.buttons[RIGHT].pressed) { x1 = 1; }
//       else { [x1] = this.gamepad.axes; }
//     }

//     const movingx = ~~(x1 * 100) / 100;

//     if (movingx) {
//       // accel
//       this.dir = Math.sign(movingx);
//       this.xvel += x1 * XVEL;
//       if (this.xvel > XVELCAP) this.xvel = XVELCAP;
//       if (this.xvel < -XVELCAP) this.xvel = -XVELCAP;
//     }
//     else {
//       // decel
//       if (this.xvel > 0) {
//         this.xvel -= XVEL;
//         if (this.xvel < 0) this.xvel = 0;
//       }
//       else if (this.xvel < 0) {
//         this.xvel += XVEL;
//         if (this.xvel > 0) this.xvel = 0;
//       }
//     }

//     if (this.xvel) {
//       const dir = Math.sign(this.xvel);
//       const max = Math.abs(this.xvel);
//       for (let i = 0; i < max; i += 1) {
//         if (!logic.tryMove(this, dir, 0)) {
//           this.xvel = 0;
//           break;
//         }
//       }
//     }
//   }

//   tryMoveY() {
//     // this.yvel += YVEL;
//     // if (this.yvel > YVELCAP) this.yvel = YVELCAP;

//     // if (this.yvel) {
//     const dir = Math.sign(this.yvel);
//     const max = Math.abs(this.yvel);
//     let broke = false;
//     for (let i = 0; i < max; i += 1) {
//       if (!logic.tryMove(this, 0, dir)) {
//         this.yvel = 0;
//         broke = true;
//         break;
//       }
//     }
//     // }
//   }

//   rumble(sec: number, weak: number, strong: number) {
//     // this.gamepad!.vibrationActuator.playEffect("dual-rumble", {
//     //   startDelay: 0,
//     //   duration: sec * 1000,
//     //   weakMagnitude: weak,
//     //   strongMagnitude: strong,
//     // });
//   }

// }
