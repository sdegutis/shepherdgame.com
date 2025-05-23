import { Game } from "../game.js";
import { DOWN, LEFT, RIGHT, UP, X } from "../lib/crt.js";
import { Img } from "../lib/image.js";
import { Collider, Entity, Interaction } from "./entity.js";
import { Solid } from "./solid.js";

export class Player extends Entity {

  override layer = 1;

  constructor(
    game: Game,
    x: number,
    y: number,
    spritesheet: number[],
    spriteIndex: number,
    private playerNum: number,
  ) {
    super(game, x, y, Img.from(spritesheet, spriteIndex));
    game.players[playerNum] = this;
  }

  get gamepad() { return navigator.getGamepads()[this.playerNum]; }

  override update? = (t: number) => {
    let x = 0, y = 0, speed = 1;

    if (this.gamepad) {
      [x, y] = this.gamepad.axes;
      if (this.gamepad.buttons[X].pressed) {
        speed = 2;
      }
    }
    else if (this.playerNum === 0) {
      if (this.game.crt.keys[RIGHT]) x = 1; else if (this.game.crt.keys[LEFT]) x = -1;
      if (this.game.crt.keys[DOWN]) y = 1; else if (this.game.crt.keys[UP]) y = -1;
      if (this.game.crt.keys[X]) speed = 2;
    }

    this.tryMove('x', x * speed);
    this.tryMove('y', y * speed);

  };

  override collideWith?: Collider = (other, dir, by) => {
    if (other instanceof Solid) return Interaction.Stop;
    return Interaction.Pass;
  };

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
