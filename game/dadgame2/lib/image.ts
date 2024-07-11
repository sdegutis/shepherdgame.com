export class Pixel {

  constructor(
    public h: number,
    public s: number,
    public l: number,
    public a: number,
  ) { }

}

export class PixelImage {

  original: Pixel[];
  constructor(public pixels: Pixel[]) {
    this.original = [...pixels];
  }

  reset() { }

}
