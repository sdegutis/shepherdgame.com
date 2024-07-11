import { HSLA } from "../lib/pico8.js";

export interface Logic {
  tryMove(entity: Entity, x: number, y: number): boolean;
  create(x: number, y: number): void;
}

export type Interaction = 'stop' | 'pass';

export class Entity {

  dead = false;
  layer = 0;

  public rx = 0;
  public ry = 0;

  private _x = 0;
  public get x(): number { return this._x; }
  public set x(v: number) { this._x = v; this.rx = Math.round(v); }

  private _y = 0;
  public get y(): number { return this._y; }
  public set y(v: number) { this._y = v; this.ry = Math.round(v); }

  constructor(
    x: number,
    y: number,
    public image: HSLA[][],
  ) {
    this.x = x;
    this.y = y;

    // for (let y = 0; y < 8; y++) {
    //   for (let x = 0; x < 8; x++) {
    //     this.image[y][x]
    //   }
    // }
  }

  draw(pixels: Uint8ClampedArray) {
    for (let y = 0; y < 8; y++) {
      const yy = this.ry + y;

      for (let x = 0; x < 8; x++) {
        const xx = this.rx + x;

        const hsla = this.image[y][x];

        if (hsla.a > 0) {
          let { h, s, l, a } = hsla;
          // h += 100; h %= 360;

          const p = (yy * 40 * 8 * 4) + (xx * 4);
          pixels[p + 0] = h;
          pixels[p + 1] = s;
          pixels[p + 2] = l;
          pixels[p + 3] = a;
        }
      }
    }
  }

  near(entity: Entity) {
    const dx = (this.x + 4) - (entity.x + 4);
    const dy = (this.y + 4) - (entity.y + 4);
    const d = Math.sqrt(dx ** 2 + dy ** 2);
    return (d < 20);
  }

  update?: (t: number, logic: Logic) => void;

  collideWith?: (other: Entity, x: number, y: number) => Interaction;

}
