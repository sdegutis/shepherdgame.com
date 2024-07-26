import { COLORS_RGBA } from "./p8.js";

export function convertRgbToHsl(colors: number[]) {
  const r = colors[0] / 255;
  const g = colors[1] / 255;
  const b = colors[2] / 255;
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const delta = max - min;
  let h = 0;
  let s;

  if (max === min) {
    h = 0;
  } else if (r === max) {
    h = (g - b) / delta;
  } else if (g === max) {
    h = 2 + (b - r) / delta;
  } else if (b === max) {
    h = 4 + (r - g) / delta;
  }

  h = Math.min(h * 60, 360);

  if (h < 0) {
    h += 360;
  }

  const l = (min + max) / 2;

  if (max === min) {
    s = 0;
  } else if (l <= 0.5) {
    s = delta / (max + min);
  } else {
    s = delta / (2 - max - min);
  }

  return [
    h,
    s * 100,
    l * 100,
    colors[3],
  ] as const;
};

export function convertHslToRgb(input: Uint16Array, offset: number, output: Uint8ClampedArray) {
  const h = input[offset + 0] / 360;
  const s = input[offset + 1] / 100;
  const l = input[offset + 2] / 100;
  let t2;
  let t3;
  let val;

  if (s === 0) {
    val = l * 255;
    output[offset + 0] = val;
    output[offset + 1] = val;
    output[offset + 2] = val;
    return;
  }

  if (l < 0.5) {
    t2 = l * (1 + s);
  } else {
    t2 = l + s - l * s;
  }

  const t1 = 2 * l - t2;

  for (let i = 0; i < 3; i++) {
    t3 = h + 1 / 3 * -(i - 1);
    if (t3 < 0) {
      t3++;
    }

    if (t3 > 1) {
      t3--;
    }

    if (6 * t3 < 1) {
      val = t1 + (t2 - t1) * 6 * t3;
    } else if (2 * t3 < 1) {
      val = t2;
    } else if (3 * t3 < 2) {
      val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
    } else {
      val = t1;
    }

    output[offset + i] = val * 255;
  }
};

export const COLORS_HSLA = COLORS_RGBA.map(convertRgbToHsl);
