export const A = 0, B = 1, X = 2, Y = 3;
export const L = 4, R = 5, ZL = 6, ZR = 7;
export const MINUS = 8, PLUS = 9;
export const LTRIGGER = 10, RTRIGGER = 11;
export const UP = 12, DOWN = 13, LEFT = 14, RIGHT = 15;
export const HOME = 16;

const WIDTH = 320;
const HEIGHT = 180;

export function setupCRT() {
  const canvas = document.createElement('canvas');
  canvas.style.height = '95vh';
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  document.body.append(canvas);

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
