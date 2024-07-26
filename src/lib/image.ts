import { COLORS_RGBA } from "./p8.js";

export class Image {

  constructor(
    public pixels: Uint16Array,
    private w: number,
    private h: number,
  ) { }

  static from(spritesheet: number[], i: number, w = 8, h = 8, ox = 0, oy = 0) {
    const img = new Uint16Array(w * h * 4);

    const x = (i % 16) * 8 + ox;
    const y = Math.floor(i / 16) * 8 + oy;

    for (let yy = 0; yy < h; yy++) {
      for (let xx = 0; xx < w; xx++) {
        const n = spritesheet[(y + yy) * 128 + (x + xx)];
        const c = COLORS_RGBA[n];

        const i = yy * w * 4 + xx * 4;
        img[i + 0] = c[0];
        img[i + 1] = c[1];
        img[i + 2] = c[2];
        img[i + 3] = c[3];
      }
    }

    return new Image(img, w, h);

  }

  draw(pixels: Uint8ClampedArray, dx: number, dy: number) {
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const i = y * this.w * 4 + x * 4;
        const i2 = Math.round(dy + y) * 320 * 4 + Math.round(dx + x) * 4;
        pixels[i2 + 0] = this.pixels[i + 0];
        pixels[i2 + 1] = this.pixels[i + 1];
        pixels[i2 + 2] = this.pixels[i + 2];
        pixels[i2 + 3] = this.pixels[i + 3];
      }
    }
  }

}
