export module grid;

import pixel;
import std;
using namespace std;

export constexpr auto WIDTH = 320;
export constexpr auto HEIGHT = 180;

export class Grid {

public:

	array<Pixel, WIDTH * HEIGHT> pixels;

	auto get(unsigned long long x, unsigned long long y) -> Pixel& {
		return pixels[y * WIDTH + x];
	}

};
