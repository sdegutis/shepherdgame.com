export class PixelImage {

  private original: Uint16Array;
  constructor(public pixels: Uint16Array) {
    this.original = pixels;
  }

  reset() {
    this.pixels = new Uint16Array(this.original);
  }

}
