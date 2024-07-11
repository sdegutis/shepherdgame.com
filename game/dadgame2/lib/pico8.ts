import colorConvert from 'https://cdn.jsdelivr.net/npm/color-convert@2.0.1/+esm';

const COLORS = [
  [0x00, 0x00, 0x00, 0x00],
  [0x1D, 0x2B, 0x53, 0xff],
  [0x7E, 0x25, 0x53, 0xff],
  [0x00, 0x87, 0x51, 0xff],
  [0xAB, 0x52, 0x36, 0xff],
  [0x5F, 0x57, 0x4F, 0xff],
  [0xC2, 0xC3, 0xC7, 0xff],
  [0xFF, 0xF1, 0xE8, 0xff],
  [0xFF, 0x00, 0x4D, 0xff],
  [0xFF, 0xA3, 0x00, 0xff],
  [0xFF, 0xEC, 0x27, 0xff],
  [0x00, 0xE4, 0x36, 0xff],
  [0x29, 0xAD, 0xFF, 0xff],
  [0x83, 0x76, 0x9C, 0xff],
  [0xFF, 0x77, 0xA8, 0xff],
  [0xFF, 0xCC, 0xAA, 0xff],
] as [number, number, number, number][];

export interface MapTile {
  index: number,
  sprite: Sprite,
}

export type HSLA = { h: number, s: number, l: number, a: number };

export interface Sprite {
  image: HSLA[][],
  flags: Flag,
}

const FLAGS = [
  'RED', 'ORANGE', 'YELLOW', 'GREEN',
  'BLUE', 'PURPLE', 'PINK', 'PEACH',
] as const;

export type Flag = { [key in typeof FLAGS[number]]?: true };

export async function loadCleanP8(filename: string) {
  const data = await loadP8(filename);

  const sprites: Sprite[] = [];
  for (let i = 0; i < 256; i++) {
    sprites.push({
      image: data.sprites[i],
      flags: data.flags[i],
    });
  }

  const map = [];
  for (let y = 0; y < 64; y++) {
    const row: MapTile[] = [];
    for (let x = 0; x < 128; x++) {
      const spr = data.map[y][x];
      row.push({
        index: spr,
        sprite: sprites[spr],
      });
    }
    map.push(row);
  }

  return { sprites, map };
}

export async function loadP8(filename: string) {
  const res = await fetch(filename, { cache: 'no-store' });
  const text = await res.text();
  const groups = parseGroups(text);
  return {
    flags: parseFlags(groups.gff),
    sprites: parseSprites(groups.gfx),
    map: parseMap(groups.map),
  };
}

function parseMap(data: string) {
  const map = [];
  for (let y = 0; y < 64; y++) {
    const row = [];
    for (let x = 0; x < 128; x++) {
      const i = x * 2;
      const ii = y * 256 + i;
      const c = data.slice(ii, ii + 2);
      const n = parseInt(y < 32 ? c : c[1] + c[0], 16);
      row.push(n);
    }
    map.push(row);
  }
  return map;
}

function parseFlags(chars: string) {
  const flags: Flag[] = [];

  for (let i = 0; i < 256; i++) {
    const ii = i * 2;
    const hex = chars.slice(ii, ii + 2);
    const n = parseInt(hex, 16);

    const flag: Flag = Object.create(null);

    for (let b = 0; b < 8; b++) {
      const bb = 1 << b;
      if (n & bb) flag[FLAGS[b]] = true;
    }

    flags.push(flag);
  }

  return flags;
}

function parseSprites(data: string) {
  const sprites = [];

  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const img: HSLA[][] = [];

      for (let yy = 0; yy < 8; yy++) {
        const row = [];
        for (let xx = 0; xx < 8; xx++) {
          const ly = y * 8 + yy;
          const lx = x * 8 + xx;

          const c = data[ly * 128 + lx];
          const n = parseInt(c, 16);

          const [r, g, b, a] = COLORS[n];
          const [h, s, l] = colorConvert.rgb.hsl(r, g, b);
          row.push({ h, s, l, a });
        }
        img.push(row);
      }

      sprites.push(img);
    }
  }

  return sprites;
}

function parseGroups(text: string) {
  const flat = text.replace(/[\r\n]/g, '');
  const gfx = (flat.match(/__gfx__([0-9abcdef]+)/)?.[1] ?? '').padEnd(128 * 128, '0');
  const map = (flat.match(/__map__([0-9abcdef]+)/)?.[1] ?? '').padEnd(128 * 32 * 2, '0') + gfx.slice(128 * 64);
  const gff = (flat.match(/__gff__([0-9abcdef]+)/)?.[1] ?? '').padEnd(256 * 2, '0');
  return { gfx, map, gff };
}
