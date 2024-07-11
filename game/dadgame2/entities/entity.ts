import colorConvert from 'https://cdn.jsdelivr.net/npm/color-convert@2.0.1/+esm';
import { COLORS } from "../lib/pico8.js";

const COLORS2 = COLORS.map(([r, g, b, a]) => ({
  hsl: colorConvert.rgb.hsl(r, g, b),
  alpha: a,
}));

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
    public image: number[][],
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

        const n = this.image[y][x];

        if (n > 0) {
          const hsla = COLORS2[n];

          let [h, s, l] = hsla.hsl;
          h += 100; h %= 360;
          const rgb = colorConvert.hsl.rgb([h, s, l]);

          const p = (yy * 40 * 8 * 4) + (xx * 4);
          pixels[p + 0] = rgb[0];
          pixels[p + 1] = rgb[1];
          pixels[p + 2] = rgb[2];
          pixels[p + 3] = hsla.alpha;
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
