export const A = 0, B = 1, X = 2, Y = 3;
export const L = 4, R = 5, ZL = 6, ZR = 7;
export const MINUS = 8, PLUS = 9;
export const LTRIGGER = 10, RTRIGGER = 11;
export const UP = 12, DOWN = 13, LEFT = 14, RIGHT = 15;
export const HOME = 16;

const WIDTH = 320;
const HEIGHT = 180;

export type CRT = ReturnType<typeof setupCRT>;

export function setupCRT() {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  document.body.append(canvas);

  new ResizeObserver(([{ contentRect: box }]) => {
    let width = 320;
    let height = 180;

    while (width + 320 <= box.width && height + 180 <= box.height) {
      width += 320;
      height += 180;
    }

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
  }).observe(document.body);

  const ctx = canvas.getContext('2d')!;
  const pixels = new Uint8ClampedArray(320 * 180 * 4);
  const imgdata = new ImageData(pixels, 320, 180);
  const blit = () => ctx.putImageData(imgdata, 0, 0);

  const crt = {
    ontick: (t: number) => { },
    pixels,
    blit,
  };

  const framerate = 30;
  let from = +document.timeline.currentTime!;

  const step = () => {
    requestAnimationFrame(t => {
      if (t - from >= framerate) {
        crt.ontick(t);
        from = t;
      }
      step();
    });
  };
  step();

  return crt;
}
