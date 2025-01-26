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
  canvas.tabIndex = 1;
  canvas.style.outline = 'none';
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  document.body.append(canvas);
  canvas.focus();

  new ResizeObserver(([{ contentRect }]) => {
    let width = WIDTH;
    let height = HEIGHT;

    while (width + WIDTH <= contentRect.width && height + HEIGHT <= contentRect.height) {
      width += WIDTH;
      height += HEIGHT;
    }

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
  }).observe(document.body);

  const ctx = canvas.getContext('2d')!;
  const pixels = new Uint8ClampedArray(WIDTH * HEIGHT * 4);
  const imgdata = new ImageData(pixels, WIDTH, HEIGHT);
  const blit = () => ctx.putImageData(imgdata, 0, 0);

  const keys: number[] = Array(16).fill(0);

  const crt = {
    ontick: (t: number) => { },
    pixels,
    blit,
    keys,
  };

  canvas.onkeydown = (e) => {
    if (e.key === 'ArrowUp') { keys[UP] = 1 }
    if (e.key === 'ArrowDown') { keys[DOWN] = 1 }
    if (e.key === 'ArrowLeft') { keys[LEFT] = 1 }
    if (e.key === 'ArrowRight') { keys[RIGHT] = 1 }
  };

  canvas.onkeyup = (e) => {
    if (e.key === 'ArrowUp') { keys[UP] = 0 }
    if (e.key === 'ArrowDown') { keys[DOWN] = 0 }
    if (e.key === 'ArrowLeft') { keys[LEFT] = 0 }
    if (e.key === 'ArrowRight') { keys[RIGHT] = 0 }
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
