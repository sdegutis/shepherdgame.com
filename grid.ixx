export module grid;

import pixel;
import std;
using namespace std;

export constexpr auto WIDTH = 320;
export constexpr auto HEIGHT = 180;

export class Grid {

	array<Pixel, WIDTH * HEIGHT> pixels;

public:

	auto get(unsigned long long x, unsigned long long y) -> Pixel& {
		return pixels[y * WIDTH + x];
	}

};
