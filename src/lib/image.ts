export class PixelImage {

  private original: Uint16Array;
  public pixels: Uint16Array;

  constructor(pixels: Uint16Array) {
    this.original = pixels;
    this.pixels = pixels;
  }

  reset() {
    this.pixels = new Uint16Array(this.original);
  }

}
