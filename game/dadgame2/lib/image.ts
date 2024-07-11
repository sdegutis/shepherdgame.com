export class Pixel {

  constructor(
    public h: number,
    public s: number,
    public l: number,
    public a: number,
  ) { }

}

export class PixelImage {

  private original: Pixel[];
  constructor(public pixels: Pixel[]) {
    this.original = pixels.map(p => ({ ...p }));
  }

  reset() {
    this.pixels = this.original.map(p => ({ ...p }));
  }

}
