export class Image {

  private original: Uint16Array;
  constructor(public pixels: Uint16Array) {
    this.original = pixels;
  }

  reset() {
    this.pixels = new Uint16Array(this.original);
  }

  draw(pixels: Uint8ClampedArray, dx: number, dy: number) {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const i = y * 8 * 4 + x * 4;
        const i2 = Math.round(dy + y) * 320 * 4 + Math.round(dx + x) * 4;
        pixels[i2 + 0] = this.pixels[i + 0];
        pixels[i2 + 1] = this.pixels[i + 1];
        pixels[i2 + 2] = this.pixels[i + 2];
        pixels[i2 + 3] = this.pixels[i + 3];
      }
    }
  }

}
