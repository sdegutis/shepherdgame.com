import { PixelImage } from '../lib/image.js';

export interface Logic {
  tryMove(entity: Entity, x: number, y: number): boolean;
}

export type Interaction = 'stop' | 'pass';

export class Entity {

  dead = false;

  constructor(
    public x: number,
    public y: number,
    public image: PixelImage,
  ) { }

  update?: (t: number, logic: Logic) => void;

  collideWith?: (other: Entity, x: number, y: number) => Interaction;

  draw(pixels: Uint16Array) {
    for (let y = 0; y < 8; y++) {
      const yy = Math.round(this.y) + y;

      for (let x = 0; x < 8; x++) {
        const xx = Math.round(this.x) + x;

        const i = y * 8 * 4 + x * 4;
        const h = this.image.pixels[i + 0];
        const s = this.image.pixels[i + 1];
        const l = this.image.pixels[i + 2];
        const a = this.image.pixels[i + 3];

        if (a > 0) {
          const p = (yy * 40 * 8 * 4) + (xx * 4);
          pixels[p + 0] = h;
          pixels[p + 1] = s;
          pixels[p + 2] = l;
          pixels[p + 3] = a;
        }
      }
    }
  }

}
